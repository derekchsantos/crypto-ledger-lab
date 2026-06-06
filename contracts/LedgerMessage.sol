// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LedgerMessage {
    string public message;

    event MessageUpdated(string newMessage);

    constructor(string memory initMessage) {
        message = initMessage;
    }

    function updateMessage(string memory newMessage) public {
        message = newMessage;
        emit MessageUpdated(newMessage);
    }
}
