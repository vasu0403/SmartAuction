// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract BaseAuction {
    struct Bid {
        bytes32 blindedBid;
        string publicKey;
    }

    address payable public beneficiary;
    uint public biddingEnd;
    uint public revealEnd;
    bool public ended;
    uint itemId;

    uint public winningBid;
    address public winner;
    string public publicKeyOfWinner;

    mapping(address => Bid) public bids;
    mapping(address => uint) pendingReturns;
    mapping(address => string) publicKeys;

    modifier onlyBefore(uint _time) {require(now < _time); _; }
    modifier onlyAfter(uint _time) {require(now > _time); _; }

    
    function bid(address bidder, bytes32 _blindedBid, string memory publicKey) public;
    function reveal(uint value, bytes32 _secret, address bidder) public returns (uint);
    function placeBid(address bidder, uint value, string memory publicKey) internal returns(bool);
    function pendingMoney(address bidder) public returns (uint);
    function canEnd() public returns(bool);
}