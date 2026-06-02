const FsocietyToken = artifacts.require("FsocietyToken");

contract("FsocietyToken", (accounts) => {
  it("deve dar o suprimento total ao criador", async () => {
    const instance = await FsocietyToken.deployed();
    const balance = await instance.balanceOf(accounts[0]);
    
    // 1 milhão com 18 zeros (10**18)
    const expectedSupply = web3.utils.toWei("1000000", "ether"); 
    
    assert.equal(balance.toString(), expectedSupply, "Saldo inicial incorreto!");
  });
});
