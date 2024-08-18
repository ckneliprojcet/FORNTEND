import React, { useState } from "react";
import Web3 from "web3";
import FootballTeamsABI from "./FootballTeamsABI.json";

// ABI and Contract Address
const CONTRACT_ABI = FootballTeamsABI;
const CONTRACT_ADDRESS = "0x2A9C558f293140bF3Bf0d833Ee7859DBc325542F";

function FootballTeams() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [playerName, setPlayerName] = useState("");
    const [teamAddress, setTeamAddress] = useState("");
    const [players, setPlayers] = useState([]);
    const [playerId, setPlayerId] = useState("");
    const [assignTeamAddress, setAssignTeamAddress] = useState("");

    // Initialize Web3 and the contract
    const initializeWeb3 = async () => {
        if (window.ethereum) {
            try {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
                setWeb3(web3Instance);
                setContract(contractInstance);
                console.log('Web3 and contract initialized successfully.');
            } catch (error) {
                console.error("Failed to initialize Web3 or contract", error);
                alert("Failed to initialize Web3 or contract. See console for details.");
            }
        } else {
            alert("Please install MetaMask to use this dApp!");
        }
    };

    // Add a new player
    const addPlayer = async () => {
        if (!web3 || !contract) {
            alert("Web3 or contract is not initialized.");
            return;
        }
        if (!playerName) {
            alert("Player name cannot be empty");
            return;
        }
        try {
            const accounts = await web3.eth.getAccounts();
            const result = await contract.methods.addPlayer(playerName).send({ from: accounts[0] });
            console.log('Player added:', result);
            alert("Player added successfully!");
        } catch (error) {
            console.error('An error occurred:', error);
            alert(`Error: ${error.message || error}`);
        }
    };

    // Assign a player to a team
    const assignPlayerToTeam = async () => {
        if (!web3 || !contract) {
            alert("Web3 or contract is not initialized.");
            return;
        }
        if (!playerId || !assignTeamAddress) {
            alert("Player ID and Team Address cannot be empty");
            return;
        }

        if (!Web3.utils.isAddress(assignTeamAddress)) {
            alert("Invalid Ethereum address provided.");
            return;
        }

        try {
            const accounts = await web3.eth.getAccounts();
            const result = await contract.methods.assignPlayerToTeam(playerId, assignTeamAddress).send({ from: accounts[0] });
            console.log('Player assigned to team:', result);
        } catch (error) {
            console.error('An error occurred:', error);
            alert(`Error: ${error.message || error}`);
        }
    };

    // Get the players in a team
    const getTeamPlayers = async () => {
        if (!web3 || !contract) {
            alert("Web3 or contract is not initialized.");
            return;
        }
        if (!Web3.utils.isAddress(teamAddress)) {
            alert("Invalid Ethereum address provided.");
            return;
        }

        try {
            const players = await contract.methods.getTeamPlayers(teamAddress).call();
            console.log('Players in team:', players);
            setPlayers(players);
        } catch (error) {
            console.error('An error occurred:', error);
            alert(`Error: ${error.message || error}`);
        }
    };

    return (
        <div className="App">
            <h1>Football Teams DApp</h1>

            <button onClick={initializeWeb3}>Connect to MetaMask</button>

            <h2>Add Player</h2>
            <input
                type="text"
                placeholder="Enter player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
            />
            <button onClick={addPlayer}>Add Player</button>

            <h2>Assign Player to Team</h2>
            <input
                type="text"
                placeholder="Enter player ID"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter team address"
                value={assignTeamAddress}
                onChange={(e) => setAssignTeamAddress(e.target.value)}
            />
            <button onClick={assignPlayerToTeam}>Assign to Team</button>

            <h2>Get Players in a Team</h2>
            <input
                type="text"
                placeholder="Enter team address"
                value={teamAddress}
                onChange={(e) => setTeamAddress(e.target.value)}
            />
            <button onClick={getTeamPlayers}>Get Players</button>

            <h3>Players in Team:</h3>
            <ul>
                {players.map((playerId, index) => (
                    <li key={index}>Player ID: {playerId}</li>
                ))}
            </ul>
        </div>
    );
}

export default FootballTeams;
