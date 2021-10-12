var SecondPriceAuction = artifacts.require("SecondPriceAuction.sol");

module.exports = function(deployer, network, accounts) {
    var arg1 = accounts[0];
    deployer.deploy(SecondPriceAuction, arg1);
};
