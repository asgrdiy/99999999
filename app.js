const contractAddress = "0x71cf0d797f62f89428c1e2ff885da6aa4b2099fd"; // Replace with your contract address
const contractABI = [ /* Paste your ABI here */ ];

let web3, contractInstance, accounts;

window.onload = async function () {
    if (window.ethereum) {
        try {
            await window.ethereum.enable();
            web3 = new Web3(window.ethereum);
            contractInstance = new web3.eth.Contract(contractABI, contractAddress);
            accounts = await web3.eth.getAccounts();
            displayGameStatus();
            displayPlayerBalance();
        } catch (error) {
            console.error("User denied account access or no Ethereum provider available");
        }
    } else {
        console.error("Please install MetaMask or use a Web3-enabled browser");
    }
};

async function displayGameStatus() {
    const minimumBet = await contractInstance.methods.minimumBet().call();
    const pot = await contractInstance.methods.pot().call();
    const isVotingOpen = await contractInstance.methods.isVotingOpen().call();
    const endTime = await contractInstance.methods.endTime().call();
    const winningOption = await contractInstance.methods.winningOption().call();
    const winningVotes = await contractInstance.methods.winningVotes().call();
    const losingVotes = await contractInstance.methods.losingVotes().call();

    document.getElementById("minimumBet").innerText = minimumBet;
    document.getElementById("pot").innerText = pot;
    document.getElementById("votingStatus").innerText = isVotingOpen ? "Open" : "Closed";
    document.getElementById("endTime").innerText = new Date(endTime * 1000).toLocaleString();
    document.getElementById("winningOption").innerText = winningOption === "1" ? "YES" : "NO";
    document.getElementById("winningVotes").innerText = winningVotes;
    document.getElementById("losingVotes").innerText = losingVotes;
}

async function displayPlayerBalance() {
    const playerBalance = await contractInstance.methods.balanceOf(accounts[0]).call();
    document.getElementById("balance").innerText = playerBalance;
}

async function placeBet() {
    const betAmount = document.getElementById("betAmount").value;
    const betOption = document.getElementById("betOption").value;

    try {
        const options = { from: accounts[0], value: betAmount };
        await contractInstance.methods.placeBet(betOption).send(options);
        displayGameStatus();
        displayPlayerBalance();
        alert("Bet placed successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to place bet!");
    }
}

async function startNewRound() {
    const durationInSeconds = 60; // Replace with the desired duration for each voting round
    try {
        await contractInstance.methods.startNewRound(durationInSeconds).send({ from: accounts[0] });
        displayGameStatus();
        alert("New round started!");
    } catch (error) {
        console.error(error);
        alert("Failed to start new round!");
    }
}

async function endVoting() {
    try {
        await contractInstance.methods.endVoting().send({ from: accounts[0] });
        displayGameStatus();
        displayPlayerBalance();
        alert("Voting ended!");
    } catch (error) {
        console.error(error);
        alert("Failed to end voting!");
    }
}

async function withdrawLosingPot() {
    try {
        await contractInstance.methods.withdrawLosingPot().send({ from: accounts[0] });
        displayGameStatus();
        displayPlayerBalance();
        alert("Losing pot withdrawn successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to withdraw losing pot!");
    }
}
