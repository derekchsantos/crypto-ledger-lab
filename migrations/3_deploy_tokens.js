const FsocietyToken = artifacts.require("FsocietyToken");

module.exports = function (deployer) {
  // Deploy do token com 1 milhão de suprimento inicial
  deployer.deploy(FsocietyToken, 1000000);
};
