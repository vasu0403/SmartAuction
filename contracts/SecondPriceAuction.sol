// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

import './BaseAuction.sol';

contract SecondPriceAuction is BaseAuction {
    uint secondHighestBid;
    constructor(address _beneficiary) public {
        beneficiary = _beneficiary;
        secondHighestBid = 0;
    }
    
    function reveal(uint value, bytes32 secret, address bidder)public returns (uint){
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
        if (value < winningBid) {
            if(secondHighestBid < value) {
                secondHighestBid = value;
            }
            return false;
        }
        if (winner != address(0)) {
            // Refund the previously highest bidder.
            pendingReturns[winner] += winningBid;
        }
        if(winningBid == 0) {
            secondHighestBid = value;
        } else {
            secondHighestBid = winningBid;
        }
        winningBid = value;
        winner = bidder;
        publicKeyOfWinner = publicKey;
        return true;
    }
    function canEnd() public returns(bool){
        if(!ended) {
            pendingReturns[winner] += (winningBid - secondHighestBid);
            winningBid = secondHighestBid;
            ended = true;
            return true;
        }
        return false;
    }
}