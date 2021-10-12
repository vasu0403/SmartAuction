// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;
import './FirstPriceAuction.sol';
// import './SecondPriceAuction.sol';
// import './AveragePriceAuction.sol';
contract SmartStore {
    /// @author Heisenberg team

    enum State {UNDEFINED, AVAILABLE, PENDING_DELIVERY, DELIVERED}
    enum AuctionState {UNDEFINED, RUNNING, REVEAL_TIME, PENDING_DELIVERY, DELIEVERED}

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

    mapping(uint => AuctionState) auctionStatus;
    /// @dev list of all products. Also includes products which have already been sold
    Listing[] private listings;
    Auction[] private auctions;

    uint listingCounter = 0;

    mapping(address => Auction[]) ownerOfAuctions;

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
    function factory(address creator, string memory method) public returns(BaseAuction){
        if(keccak256(abi.encodePacked(method)) == keccak256(abi.encodePacked("FirstPrice"))) {
            return new FirstPriceAuction(creator);
        } else if (keccak256(abi.encodePacked(method)) == keccak256(abi.encodePacked("SecondPrice"))) {
            // return new SecondPriceAuction(creator); 
        } else if (keccak256(abi.encodePacked(method)) == keccak256(abi.encodePacked("AveragePrice"))) {
            // return new AveragePriceAuction(creator); 
        }
        // } else if (keccak256(abi.encodePacked(method)) == keccak256(abi.encodePacked("SecondPrice"))) {
        //     return new SecondPriceAuction(biddingTime, revealTime, creator); 
        // } else if (keccak256(abi.encodePacked(method)) == keccak256(abi.encodePacked("AveragePrice"))) {
        //     return new AveragePriceAuction(biddingTime, revealTime, creator); 
        // }
    }
    function addAuction(string memory itemName, string memory itemDescription, string memory method) public {
        Auction memory auction = Auction(listingCounter, itemName, itemDescription, msg.sender, method);
        auctions.push(auction);
        auctionContracts[listingCounter] = factory(msg.sender, method);
        sellers[listingCounter] = msg.sender;
        auctionStatus[listingCounter] = AuctionState.RUNNING;
        listingCounter++;
        ownerOfAuctions[msg.sender].push(auction);
    }

    function placeBid(uint auctionID, bytes32 _blindedBid, string memory publicKey) public{
        require(auctionStatus[auctionID] == AuctionState.RUNNING, "Bidding Period is over"); 
        auctionContracts[auctionID].bid(msg.sender, _blindedBid, publicKey);
    }
    function revealBid(uint auctionID, uint value, bytes32 secret) public payable{
        require(auctionStatus[auctionID] == AuctionState.REVEAL_TIME, "Reveal time is either over, or has not started yet");
        uint refundAmount = auctionContracts[auctionID].reveal(value, secret, msg.sender);
        address payable bidderAddress = msg.sender;
        bidderAddress.transfer(refundAmount);
    }
    function getAuctions() public view returns (Auction[] memory) {
        uint available = 0;
        for(uint i = 0; i < auctions.length; i++) {
            uint itemID = auctions[i].auctionID;
            if(auctionStatus[itemID] == AuctionState.RUNNING) {
                available++;
            }
        }

        Auction[] memory activeAuctions = new Auction[](available);
        uint index = 0;
        for(uint i = 0; i < auctions.length; i++) {
            uint itemID = auctions[i].auctionID;
            if(auctionStatus[itemID] == AuctionState.RUNNING) {
                activeAuctions[index++] = auctions[i];
            }
        }
        return activeAuctions;
    }
    function endBiddingTime(uint auctionID) public {
        bool found = false;
        for(uint i = 0; i < ownerOfAuctions[msg.sender].length; i++) {
            if(ownerOfAuctions[msg.sender][i].auctionID == auctionID) {
                found = true;
                break;
            }
        }
        require(found == true, "You are not the owner of this auction");
        require(auctionStatus[auctionID] == AuctionState.RUNNING, "Bidding has not started or has already ended");
        auctionStatus[auctionID] = AuctionState.REVEAL_TIME;
    }
    function endAuction(uint auctionID) public {
        if(auctionStatus[auctionID] != AuctionState.REVEAL_TIME) {
            return;
        }
        if(auctionContracts[auctionID].canEnd()) {
            auctionStatus[auctionID] = AuctionState.PENDING_DELIVERY;
            address winner = auctionContracts[auctionID].winner();
            uint amount = auctionContracts[auctionID].winningBid();
            string memory publicKeyOfWinner = auctionContracts[auctionID].publicKeyOfWinner();
            buyers[auctionID] = winner;
            Auction memory currentAuction;
            status[auctionID] = State.PENDING_DELIVERY;
            for(uint i = 0; i < auctions.length; i++) {
                if(auctionID == auctions[i].auctionID) {
                    currentAuction = auctions[i];
                    break;
                }
            }
            PendingItem memory pendingItem = PendingItem(currentAuction.auctionID, currentAuction.itemName, currentAuction.itemDescription, amount, publicKeyOfWinner);
            pendingDeliveries[currentAuction.sellerId].push(pendingItem);
        }
    }

    function getNumberOfAuctions() public returns (uint) {
        return auctions.length;
    }

    function getParticularAuction(uint idx) public returns (Auction memory) {
        return auctions[idx];
    }

    function getStatusOfAuction(uint auctionID) public view returns (bool) {
        if(auctionStatus[auctionID] == AuctionState.RUNNING) {
            return true;
        } else {
            return false;
        }
    }
    
    function getAuctionBiddingTimeEnded(uint idx) public view returns (bool) {
        if(block.timestamp > auctions[idx].startTime + auctions[idx].biddingTime){
            return true;
        } else {
            return false;
        }
    }

    function getHash(uint value, bytes32 secret) public view returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(value, secret));
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
        Listing memory item;
        for(uint i = 0; i < listings.length; i++) {
            if(listings[i].listingID == itemID) {
                item = listings[i];
                break;
            }
        }
        require (
            msg.value == item.askingPrice,
            "Sent amount should be equal to asking price !"
        );
        

        buyers[itemID] = msg.sender;

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

    function getNumberOfPendingTransactions() public returns (uint) {
        return pendingDeliveries[msg.sender].length;
    }

    function getParticularPendingListing(uint idx) public view returns (PendingItem memory) {
        return pendingDeliveries[msg.sender][idx];
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
        PendingItem memory pendingItem;
        for(uint i = 0; i < len; i++) {
            if(pendingDeliveries[msg.sender][i].listingID == itemID) {
                pendingItem = pendingDeliveries[msg.sender][i];
                pendingDeliveries[msg.sender][i] = pendingDeliveries[msg.sender][len - 1];
                delete pendingDeliveries[msg.sender][len - 1];
                pendingDeliveries[msg.sender].length--;
                break;
            }
        }

        address buyerAddress = buyers[itemID];
        BoughtItem memory boughtItem = BoughtItem(pendingItem.listingID, pendingItem.itemName, pendingItem.itemDescription, itemText);

        myItems[buyerAddress].push(boughtItem);  
        
        address payable sellerAddress = msg.sender;
        sellerAddress.transfer(pendingItem.askingPrice);
    }

    /**
     * @notice buyers can use this function to get a list of products which they bought and that have been delievered 
     * @return list of products which have been delievered to a particular buyer
     */
    function getItems() public view returns (BoughtItem[] memory){
        return myItems[msg.sender];
    }

    function getNumberOfItems() public returns (uint) {
        return myItems[msg.sender].length;
    }

    function getParticularOrderItem(uint idx) public view returns (BoughtItem memory) {
        return myItems[msg.sender][idx];
    } 
    function getPendingMoney(uint auctionID) public {
        uint amount = auctionContracts[auctionID].pendingMoney(msg.sender);
        address payable bidderAddress = msg.sender;
        bidderAddress.transfer(amount);
    }   
}
