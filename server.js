const WebSockets = require("ws");
const uuid = require("uuid");

const express = require('express')
const app = express()
const port = 3004

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
});
  
app.listen(port, () => {
    console.log(`game app listening at http://localhost:${port}`)
});

const webSocket = new WebSockets.Server({
    port: 3005,
});

const connections = {

}
const gameState = {
    
}

const broadcastUpdate = (playerId) => {
    Object.keys(gameState).forEach((socketId) => {
        if (playerId === socketId) return;
        connections[socketId].send(JSON.stringify({
            type: "UPDATE",
            x: gameState[playerId].x,
            y: gameState[playerId].y,
            playerId,
        }));
    });
}

const broadcastDisconnect = (playerId) => {
    delete gameState[playerId];
    delete connections[playerId];
    Object.keys(gameState).forEach((socketId) => {
        connections[socketId].send(JSON.stringify({
            type: "OPPONENT_DISCONNECTED",
            playerId,
        }));
    });
}


webSocket.on("connection", (socket, req) => {
    const playerId = uuid.v4();

    connections[playerId] = socket;
    gameState[playerId] = {
        x:  Math.floor(Math.random() * 500),
        y: Math.floor(Math.random() * 500),
    };

    // Give the connected player their id
    socket.send(JSON.stringify({
        type: "CONNECTED",
        playerId,
        gameState
    }));

    // Tell other clients about the new connection
    Object.keys(connections).forEach((socketId) => {
        if (playerId == socketId) return;
        connections[socketId].send(JSON.stringify({
            type: "OPPONENT_CONNECTED",
            playerId,
            gameState, 
        }));
    });

    socket.on('close', (code, playerId) => {
        console.log(`closed ${code} ${playerId}`);
        let disconnectedPlayerId;
        Object.keys(connections).forEach((playerId) => {
            if (connections[playerId] === socket){
                disconnectedPlayerId = playerId;
                broadcastDisconnect(disconnectedPlayerId);
            }
        });

        if (disconnectedPlayerId){
            delete connections[disconnectedPlayerId];
        }
    });

    socket.on("message", (data) => {
        const message = JSON.parse(data);
        switch(message.type){
            case("UPDATE"):
                console.log(`received a update ${data}`);
                gameState[message.playerId].x = message.x;
                gameState[message.playerId].y = message.y;
                broadcastUpdate(message.playerId);
                break;
            case("TEST"):
                console.log("HIT THIS")
                break;
        }

    });

    console.log(`received a connection, there are ${Object.keys(connections).length} connections`);
});