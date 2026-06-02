//@author Derek Christopher

const LedgerMessage = artifacts.require("LedgerMessage");

contract("LedgerMessage", (accounts) => {
  it("deve iniciar com a mensagem correta", async () => {
    const instance = await LedgerMessage.deployed();
    const message = await instance.message();
    assert.equal(message, "Sistema fsociety ativo.", "A mensagem inicial está errada!");
  });

  it("deve atualizar a mensagem corretamente", async () => {
    const instance = await LedgerMessage.deployed();
    await instance.updateMessage("Novo comando enviado.", { from: accounts[0] });
    const newMessage = await instance.message();
    assert.equal(newMessage, "Novo comando enviado.", "A mensagem não foi atualizada!");
  });
});
