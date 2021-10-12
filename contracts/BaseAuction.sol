// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract BaseAuction {
    struct Bid {
        bytes32 blindedBid;
        string publicKey;
    }
    /// @dev address of auction holder
    address public beneficiary;
    /// @dev stores whether auction has ended or not
    bool public ended;
    /// @dev id of the item which is up for bidding
    uint itemId;

    /// @dev bidding of the person who won the auction
    uint public winningBid;
    /// @dev address of person who won the auction
    address public winner;
    /// @dev public key of the person who won the auction
    string public publicKeyOfWinner;

    /// @dev stores the bid of each person
    mapping(address => Bid) public bids;
    /// @dev stores the amount of money which needs to be refunded to each person
    mapping(address => uint) pendingReturns;
    /// @dev stores the public key of all those who participaed in the bidding
    mapping(address => string) publicKeys;
    
    /**
     * @notice used for placing the bid on the auction
     * @param bidder address of the person revealing the bid
     * @param _blindedBid hash of the actual bid
     * @param publicKey the public key with which seller can encrypt the item text
     */
    function bid(address bidder, bytes32 _blindedBid, string memory publicKey) public {
        bids[bidder] = Bid({blindedBid: _blindedBid, publicKey: publicKey});
    }
    
    /**
     * @notice used for revealing the bid on the auction
     * @param value id of auction on which bid is being placed
     * @param _secret hash of the actual bid
     * @param bidder the public key with which seller can encrypt the item text
     */
    function reveal(uint value, bytes32 _secret, address bidder) public returns (uint);

    /// @dev internal function for placing a bid on the auction
    function placeBid(address bidder, uint value, string memory publicKey) internal returns(bool);
    
    /**
     * @notice returns the amount of money which is to be refunded to a particular bidder
     * @param bidder address of bidder
     */
    function pendingMoney(address bidder) public returns (uint){
        uint amount = pendingReturns[bidder];
        if (amount > 0) {
            pendingReturns[bidder] = 0;
        }
        return amount;
    }
    /**
     * @notice function for ending the auction (if possible)
     */
    function canEnd() public returns(bool);
}