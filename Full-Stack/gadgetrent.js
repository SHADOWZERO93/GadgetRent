
const contractABI = [
  
];
const contractAddress = "YOUR_CONTRACT_ADDRESS";

let account;
let contract;


async function connectEthereum() {
    if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        account = await signer.getAddress();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        loadGadgets();
    } else {
        alert("Please install MetaMask!");
    }
}


async function listGadget() {
    const name = document.getElementById("gadgetName").value;
    const description = document.getElementById("description").value;
    const rentalPrice = document.getElementById("rentalPrice").value;

    if (contract) {
        const tx = await contract.listGadget(name, description, ethers.parseEther(rentalPrice));
        await tx.wait();
        loadGadgets();
    }
}


async function loadGadgets() {
    const gadgetsGrid = document.getElementById("gadgetsGrid");
    gadgetsGrid.innerHTML = "";

    if (contract) {
        const count = await contract.gadgetCount();
        for (let i = 1; i <= count; i++) {
            const gadget = await contract.gadgets(i);

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h3>${gadget.name}</h3>
                <p>${gadget.description}</p>
                <p>${ethers.formatEther(gadget.rentalPrice)} ETH</p>
                <button class="${gadget.isAvailable ? 'rent-btn' : 'return-btn'}"
                        onclick="${gadget.isAvailable ? `rentGadget(${gadget.id}, '${gadget.rentalPrice}')` : `returnGadget(${gadget.id})`}">
                    ${gadget.isAvailable ? "Rent" : "Return"}
                </button>
            `;

            gadgetsGrid.appendChild(card);
        }
    }
}

async function rentGadget(id, price) {
    if (contract) {
        const tx = await contract.rentGadget(id, { value: ethers.parseEther(price) });
        await tx.wait();
        loadGadgets();
    }
}


async function returnGadget(id) {
    if (contract) {
        const tx = await contract.returnGadget(id);
        await tx.wait();
        loadGadgets();
    }
}


document.getElementById("listButton").addEventListener("click", listGadget);

connectEthereum();
