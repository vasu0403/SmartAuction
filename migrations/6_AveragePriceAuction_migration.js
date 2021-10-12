var AveragePriceAuction = artifacts.require("AveragePriceAuction.sol");

module.exports = function(deployer, network, accounts) {
    var arg1 = 0;
    var arg2 = 0;
    var arg3 = accounts[0];
    deployer.deploy(AveragePriceAuction, arg1, arg2, arg3);
};
