const FsocietyToken = artifacts.require("FsocietyToken");

contract("FsocietyToken", (accounts) => {
  it("deve dar o suprimento total ao criador", async () => {
    const instance = await FsocietyToken.deployed();
    const balance = await instance.balanceOf(accounts[0]);
    assert.equal(balance.toString(), (1000000 * 10**18).toString(), "Saldo inicial incorreto!");
  });
});
