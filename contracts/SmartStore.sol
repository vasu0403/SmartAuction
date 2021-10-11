// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;
import './FirstPriceAuction.sol';

contract Factory {
    
}
contract SmartStore {
    /// @author Heisenberg team

    enum State {UNDEFINED, AVAILABLE, PENDING_DELIVERY, DELIVERED}

    struct Listing {
        uint listingID;
        string itemName;
        string itemDescription;
        uint askingPrice;
        address sellerID;
    }

    struct Auction {
        uint auctionID;
        string itemName;
        string itemDescription;
        address sellerId;
        uint startTime;
        uint biddingTime;
        uint revealTime;
        string method;
    }

    struct PendingItem {
        uint listingID;
        string itemName;
        string itemDescription;
        uint askingPrice;
        string publicKey;
    }

    struct BoughtItem {
        uint listingID;
        string itemName;
        string itemDescription;
        string itemText;
    }


    constructor() public {

    }

    /// @dev list of pending deliveries for each seller
    mapping(address => PendingItem[]) pendingDeliveries;
    /// @dev address of the seller who is selling a particular product
    mapping(uint => address) sellers;
    /// @dev address of the person who has paid money to the contract to buy a particular product
    mapping(uint => address) buyers;
    /// @dev state of each product in the listing
    mapping(uint => State) status;
    /// @dev list of items which each person has bought and has been deliverd
    mapping(address => BoughtItem[]) myItems;
    mapping(uint => BaseAuction) auctionContracts;

    /// @dev list of all products. Also includes products which have already been sold
    Listing[] private listings;
    Auction[] private auctions;

    uint listingCounter = 0;
    uint auctionCounter = 0;

    modifier onlyAvailable(uint itemID) {
        require (
            status[itemID] == State.AVAILABLE,
            "Item not available."
        );
        _;
    }

    modifier onlySeller(uint itemID) {
        require (
            sellers[itemID] == msg.sender,
            "You are not the seller of this item."
        );
        _;
    }


    /**
     * @notice sellers use this to add a new product they want to sell into the list of available products
     * @param itemName the name of the item to be sold
     * @param itemDescription description of the item to be sold 
     * @param askingPrice price of the item to be sold
     */
    function addListing(string memory itemName, string memory itemDescription, uint askingPrice) public {
        Listing memory listing = Listing(listingCounter, itemName, itemDescription, askingPrice, msg.sender);
        sellers[listingCounter] = msg.sender;
        status[listingCounter] = State.AVAILABLE;
        listings.push(listing);
        listingCounter++;
    }
    function getNumberOfListings() public returns (uint) {
        return listings.length;
    }

    function getParticularListing(uint idx) public view returns (Listing memory) {
        return listings[idx];
    }

    function getStatusOfListing(uint itemID) public view returns (bool) {
        if(status[itemID] == State.AVAILABLE) {
            return true;
        } else {
            return false;
        }
    }

    function addAuction(string memory itemName, string memory itemDescription, uint biddingTime, uint revealTime, string memory method) public {
        Auction memory auction = Auction(auctionCounter, itemName, itemDescription, msg.sender, now, biddingTime, revealTime, method);
        auctions.push(auction);
        auctionContracts[auctionCounter] = new FirstPriceAuction(biddingTime, revealTime, msg.sender);
        auctionCounter++;
    }

    function placeBid(uint auctionID, bytes32 _blindedBid) public payable{
        auctionContracts[auctionID].bid(msg.sender, _blindedBid, msg.value);
    }
    function revealBid(uint auctionID, uint[] memory values, bool[] memory fake, bytes32 secret) public {
        uint refundAmount = auctionContracts[auctionID].reveal(values, fake, secret, msg.sender);
        address payable bidderAddress = msg.sender;
        bidderAddress.transfer(refundAmount);
    }
    function getAuctions() public view returns (Auction[] memory) {
        uint available = 0;
        for(uint i = 0; i < auctions.length; i++) {
            uint itemID = auctions[i].auctionID;
            if(now < auctions[i].startTime + auctions[i].biddingTime) {
                available++;
            }
        }

        Auction[] memory activeAuctions = new Auction[](available);
        uint index = 0;
        for(uint i = 0; i < auctions.length; i++) {
            uint itemID = auctions[i].auctionID;
            if(now < auctions[i].startTime + auctions[i].biddingTime) {
                activeAuctions[index++] = auctions[i];
            }
        }
        return activeAuctions;
    }
    function getHash(uint value, bool fake, bytes32 secret) public view returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(value, fake, secret));
        return hash;
    }
    /**
     * @notice used to get a list of all the products which are available for sale
     * @return the list of active products
     */
    function getListings() public view returns (Listing[] memory) {
        uint available = 0;
        for(uint i = 0; i < listings.length; i++) {
            uint itemID = listings[i].listingID;
            if(status[itemID] == State.AVAILABLE) {
                available++;
            }
        }

        Listing[] memory activeListings = new Listing[](available);
        uint index = 0;
        for(uint i = 0; i < listings.length; i++) {
            uint itemID = listings[i].listingID;
            if(status[itemID] == State.AVAILABLE) {
                activeListings[index++] = listings[i];
            }
        }
        return activeListings;
    }

    /**
     * @notice buyers use this to buy a product which is available for sale
     * @dev calling this function adds the product into the list of pending deliveries for the corresponding seller 
     * @param itemID ID of the item to be bought
     * @param publicKey publick key which will be used for encrypting the product string by the seller. Buyer must have the corresponding private key to decrypt the message
     */
    function buyListing(uint itemID, string memory publicKey) public onlyAvailable(itemID) payable {
        require (
            msg.value == listings[itemID].askingPrice,
            "Sent amount should be equal to asking price !"
        );
        

        buyers[itemID] = msg.sender;

        Listing memory item = listings[itemID];

        status[itemID] = State.PENDING_DELIVERY;
        
        address sellerAddress = sellers[itemID];
        PendingItem memory pendingItem = PendingItem(item.listingID, item.itemName, item.itemDescription, item.askingPrice, publicKey);
        pendingDeliveries[sellerAddress].push(pendingItem);
    }

    /**
     * @notice sellers can use this to get a list of products they need to deliever
     * @return the list of products which needs to be delievered
     */
    function getPendingTransactions() public view returns (PendingItem[] memory) {
        return pendingDeliveries[msg.sender];
    }

    /**
     * @notice function to deliver an item. The seller must send the itemText by correctly encrypting it with the public key assosciated with that product
     * @param itemID ID of the product which needs to be delivered
     * @param itemText encrypted text assosicated with the product that is being delivered
     */ 
    function delieverItem(uint itemID, string memory itemText) public onlySeller(itemID) {
        
        require (
            status[itemID] == State.PENDING_DELIVERY,
            "This item is not in the pending delievery state."
        );

        
        status[itemID] = State.DELIVERED;

        uint len = pendingDeliveries[msg.sender].length;
        for(uint i = 0; i < len; i++) {
            if(pendingDeliveries[msg.sender][i].listingID == itemID) {
                pendingDeliveries[msg.sender][i] = pendingDeliveries[msg.sender][len - 1];
                delete pendingDeliveries[msg.sender][len - 1];
                pendingDeliveries[msg.sender].length--;
                break;
            }
        }

        address buyerAddress = buyers[itemID];
        Listing memory item = listings[itemID];
        BoughtItem memory boughtItem = BoughtItem(item.listingID, item.itemName, item.itemDescription, itemText);

        myItems[buyerAddress].push(boughtItem);  
        
        address payable sellerAddress = msg.sender;
        sellerAddress.transfer(listings[itemID].askingPrice);
    }

    /**
     * @notice buyers can use this function to get a list of products which they bought and that have been delievered 
     * @return list of products which have been delievered to a particular buyer
     */
    function getItems() public view returns (BoughtItem[] memory){
        return myItems[msg.sender];
    }
}
