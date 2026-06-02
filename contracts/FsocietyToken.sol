// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//@author Derek Christopher 
contract FsocietyToken is ERC20, Ownable {
    mapping(address => bool) public isBlacklisted;

    constructor(uint256 initialSupply) ERC20("Fsociety Coin", "FSC") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function addToBlacklist(address _user) public onlyOwner {
        isBlacklisted[_user] = true;
    }

    // Override da função de transferência para checar a blacklist
    function _update(address from, address to, uint256 value) internal override {
        require(!isBlacklisted[from], "Remetente na blacklist");
        require(!isBlacklisted[to], "Destinatario na blacklist");
        super._update(from, to, value);
    }
}
