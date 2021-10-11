// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract BaseAuction {
    struct Bid {
        bytes32 blindedBid;
        uint deposit;
    }

    address payable public beneficiary;
    uint public biddingEnd;
    uint public revealEnd;
    bool public ended;
    uint itemId;

    mapping(address => Bid[]) public bids;
    mapping(address => uint) pendingReturns;

    modifier onlyBefore(uint _time) {require(now < _time); _; }
    modifier onlyAfter(uint _time) {require(now > _time); _; }

    
    function bid(address bidder, bytes32 _blindedBid, uint deposit) public;
    function reveal(uint[] memory _values, bool[] memory _fake, bytes32 _secret, address bidder) public returns (uint);
    function placeBid(address bidder, uint value) internal returns(bool);
    function pendingMoney(address bidder) public returns (uint);
    function auctionEnd() public;
}