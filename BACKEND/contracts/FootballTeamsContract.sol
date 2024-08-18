// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FootballTeams {
    struct Player {
        string name;
        address team;
    }

    // Mapping from player ID to Player struct
    mapping(uint => Player) public players;

    // Mapping from team address to list of player IDs
    mapping(address => uint[]) public teamPlayers;

    // Total number of players
    uint public playerCount;

    // Event to notify when a new player is added
    event PlayerAdded(uint indexed playerId, string name, address indexed team);

    // Event to notify when a player is assigned to a team
    event PlayerAssigned(uint indexed playerId, address indexed team);

    // Add a new player
    function addPlayer(string memory _name) public returns (uint) {
        playerCount++;
        players[playerCount] = Player(_name, address(0));

        emit PlayerAdded(playerCount, _name, address(0));
        return playerCount;
    }

    // Assign a player to a team
    function assignPlayerToTeam(uint _playerId, address _team) public {
        require(_playerId > 0 && _playerId <= playerCount, "Invalid player ID");
        require(_team != address(0), "Invalid team address");

        players[_playerId].team = _team;
        teamPlayers[_team].push(_playerId);

        emit PlayerAssigned(_playerId, _team);
    }

    // Get the number of players in a team
    function getTeamPlayerCount(address _team) public view returns (uint) {
        return teamPlayers[_team].length;
    }

    // Get the player IDs of a team
    function getTeamPlayers(address _team) public view returns (uint[] memory) {
        return teamPlayers[_team];
    }

    // Get player details by ID
    function getPlayer(uint _playerId) public view returns (string memory name, address team) {
        require(_playerId > 0 && _playerId <= playerCount, "Invalid player ID");
        Player storage player = players[_playerId];
        return (player.name, player.team);
    }
}
