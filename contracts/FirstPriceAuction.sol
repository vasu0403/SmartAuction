// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

import './BaseAuction.sol';

contract FirstPriceAuction is BaseAuction {
    uint highestBid;
    address highestBidder;
    constructor(uint _biddingTime, uint _revealTime, address payable _beneficiary) public {
        beneficiary = _beneficiary;
        biddingEnd = now + _biddingTime;
        revealEnd = biddingEnd + _revealTime;
    }
    function bid(address bidder, bytes32 _blindedBid, uint deposit) onlyBefore(biddingEnd) public {
        bids[bidder].push(Bid({blindedBid: _blindedBid, deposit: deposit}));
    }
    function reveal(uint[] memory values, bool[] memory fakes, bytes32 secrets, address bidder) onlyAfter(biddingEnd) onlyBefore(revealEnd) public returns (uint){
        uint length = bids[bidder].length;
        require(values.length == length);
        require(fakes.length == length);
        // require(secrets.length == length);

        uint refund = 0;
        for(uint i = 0; i < length; i++) {
            Bid storage bidToCheck  = bids[bidder][i];
            (uint value, bool fake, bytes32 secret) = (values[i], fakes[i], secrets);
            if (bidToCheck.blindedBid != keccak256(abi.encodePacked(value, fake, secret))) {
                continue;
            }
            refund += bidToCheck.deposit;
            if (!fake && bidToCheck.deposit >= value) {
                if (placeBid(bidder, value))
                    refund -= value;
            }
            bidToCheck.blindedBid = bytes32(0);
        }
        return refund;
    }
    function placeBid(address bidder, uint value) internal returns(bool){
        if (value <= highestBid) {
            return false;
        }
        if (highestBidder != address(0)) {
            // Refund the previously highest bidder.
            pendingReturns[highestBidder] += highestBid;
        }
        highestBid = value;
        highestBidder = bidder;
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
    function auctionEnd() public {
        ended = true;
        beneficiary.transfer(highestBid);
    }
}