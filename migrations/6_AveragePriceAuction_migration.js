var AveragePriceAuction = artifacts.require("AveragePriceAuction.sol");

module.exports = function(deployer, network, accounts) {
    var arg1 = accounts[0];
    deployer.deploy(AveragePriceAuction, arg1);
};
