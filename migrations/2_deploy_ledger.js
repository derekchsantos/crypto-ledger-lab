const LedgerMessage = artifacts.require("LedgerMessage");

module.exports = function (deployer) {
  deployer.deploy(LedgerMessage, "Sistema fsociety ativo.");
};
