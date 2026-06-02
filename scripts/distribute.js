//@author Derek Christopher

const FsocietyToken = artifacts.require("FsocietyToken");

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const token = await FsocietyToken.deployed();
    const amount = web3.utils.toWei("1000", "ether");

    console.log("Iniciando distribuição...");
    for (let i = 1; i < 5; i++) { // Envia para as primeiras 5 contas
      await token.transfer(accounts[i], amount);
      console.log(`Enviado 1000 FSC para ${accounts[i]}`);
    }
    console.log("Distribuição concluída!");
    callback();
  } catch (error) {
    callback(error);
  }
};
