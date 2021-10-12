// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract BaseAuction {
    struct Bid {
        bytes32 blindedBid;
        string publicKey;
    }

    address public beneficiary;
    bool public ended;
    uint itemId;

    uint public winningBid;
    address public winner;
    string public publicKeyOfWinner;

    mapping(address => Bid) public bids;
    mapping(address => uint) pendingReturns;
    mapping(address => string) publicKeys;
    
    function bid(address bidder, bytes32 _blindedBid, string memory publicKey) public {
        bids[bidder] = Bid({blindedBid: _blindedBid, publicKey: publicKey});
    }
    function reveal(uint value, bytes32 _secret, address bidder) public returns (uint);
    function placeBid(address bidder, uint value, string memory publicKey) internal returns(bool);
    function pendingMoney(address bidder) public returns (uint){
        uint amount = pendingReturns[bidder];
        if (amount > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `transfer` returns (see the remark above about
            // conditions -> effects -> interaction).

            pendingReturns[bidder] = 0;
        }
        return amount;
    }
    function canEnd() public returns(bool);
}