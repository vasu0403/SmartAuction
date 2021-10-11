var SmartStore = artifacts.require("./SmartStore.sol");

module.exports = function(deployer) {
  deployer.deploy(SmartStore);
};
