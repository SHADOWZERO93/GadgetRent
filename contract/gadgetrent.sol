// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GadgetRent {
    struct Gadget {
        uint id;
        string name;
        string description;
        uint rentalPrice;
        address owner;
        bool isAvailable;
    }

    mapping(uint => Gadget) public gadgets;
    mapping(uint => address) public rentedBy;
    uint public gadgetCount;
    
    event GadgetListed(uint indexed id, string name, uint rentalPrice, address owner);
    event GadgetRented(uint indexed id, address renter);
    event GadgetReturned(uint indexed id, address renter);

    function listGadget(string memory _name, string memory _description, uint _rentalPrice) public {
        gadgetCount++;
        gadgets[gadgetCount] = Gadget(gadgetCount, _name, _description, _rentalPrice, msg.sender, true);
        emit GadgetListed(gadgetCount, _name, _rentalPrice, msg.sender);
    }

    function rentGadget(uint _id) public payable {
        require(gadgets[_id].isAvailable, "Gadget is not available");
        require(msg.value >= gadgets[_id].rentalPrice, "Insufficient payment");

        gadgets[_id].isAvailable = false;
        rentedBy[_id] = msg.sender;

        payable(gadgets[_id].owner).transfer(msg.value);
        emit GadgetRented(_id, msg.sender);
    }

    function returnGadget(uint _id) public {
        require(rentedBy[_id] == msg.sender, "Not rented by you");
        gadgets[_id].isAvailable = true;
        rentedBy[_id] = address(0);

        emit GadgetReturned(_id, msg.sender);
    }
}
