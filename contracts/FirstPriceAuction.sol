// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

import './BaseAuction.sol';

contract FirstPriceAuction is BaseAuction {
    constructor(uint _biddingTime, uint _revealTime, address payable _beneficiary) public {
        beneficiary = _beneficiary;
        biddingEnd = now + _biddingTime;
        revealEnd = biddingEnd + _revealTime;
    }
    function bid(address bidder, bytes32 _blindedBid, string memory publicKey) onlyBefore(biddingEnd) public {
        bids[bidder] = Bid({blindedBid: _blindedBid, publicKey: publicKey});
    }
    function reveal(uint value, bytes32 secret, address bidder) onlyAfter(biddingEnd) onlyBefore(revealEnd) public returns (uint){
        uint refund = 0;
        Bid storage bidToCheck  = bids[bidder];
        if (bidToCheck.blindedBid != keccak256(abi.encodePacked(value, secret))) {
            return value;
        }
        refund += value;
        if (placeBid(bidder, value, bidToCheck.publicKey))
            refund -= value;
        bidToCheck.blindedBid = bytes32(0);
        return refund;
    }
    function placeBid(address bidder, uint value, string memory publicKey) internal returns(bool){
        if (value <= winningBid) {
            return false;
        }
        if (winner != address(0)) {
            // Refund the previously highest bidder.
            pendingReturns[winner] += winningBid;
        }
        winningBid = value;
        winner = bidder;
        publicKeyOfWinner = publicKey;
        return true;
    }
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
    function canEnd() public returns(bool){
        if(block.timestamp > revealEnd) {
            ended = true;
            return true;
        }
        return false;
    }
}