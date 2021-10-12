var FirstPriceAuction = artifacts.require("FirstPriceAuction.sol");

module.exports = function(deployer, network, accounts) {
    var arg1 = accounts[0];
    deployer.deploy(FirstPriceAuction, arg1);
};
