// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

import './BaseAuction.sol';

contract AveragePriceAuction is BaseAuction {
    uint cummulativeBid;
    uint numberOfBids;
    uint[] allBids;
    address[] allBidders;
    string[] allPublicKeys;
    constructor(address _beneficiary) public {
        beneficiary = _beneficiary;
        cummulativeBid = 0;
        numberOfBids = 0;
    }
    
    function reveal(uint value, bytes32 secret, address bidder) public returns (uint){
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
        allBids.push(value);
        allBidders.push(bidder);
        allPublicKeys.push(publicKey);
        cummulativeBid += value;
        numberOfBids += 1;
        return true;
    }
    function abs(int x) internal returns(int){
        if(x > 0) return x;
        return -x;
    }
    function canEnd() public returns(bool){
        if(!ended) {
            uint averageBid = (cummulativeBid / numberOfBids);
            uint len = allBids.length;
            if(len == 0) {
                return true;
            }
            winner = allBidders[0];
            winningBid = allBids[0];
            publicKeyOfWinner = allPublicKeys[0];
            int curDiff = abs(int(winningBid) - int(averageBid));
            for(uint i = 1; i < len; i++) {
                int currentBid = int(allBids[i]);
                int newDiff = abs(int(currentBid) - int(averageBid));
                if(newDiff < curDiff) {
                    pendingReturns[winner] += winningBid;
                    winner = allBidders[i];
                    winningBid = uint(currentBid);
                    publicKeyOfWinner = allPublicKeys[i];
                    curDiff = newDiff;
                } else {
                    pendingReturns[allBidders[i]] += uint(currentBid);
                }
            }
            return true; 
        }
        return false;
    }
}