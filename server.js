const WebSockets = require("ws");
const uuid = require("uuid");
const game = require("./game");

const express = require('express')
const app = express()
const port = 3004

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
});
  
app.get('/game.js', (req, res) => {
    res.sendFile(__dirname + '/game.js');
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
    players: {},
    platforms: {},
    projectiles: {}
}

gameState.platforms[uuid.v4()] = {
    x: 100,
    y: 400,
    width: 300,
    height: 50
}
gameState.platforms[uuid.v4()] = {
    x: 250,
    y: 350,
    width: 50,
    height: 50,
}

const broadcastUpdate = () => {
    Object.keys(connections).forEach((socketId) => {
        connections[socketId].send(JSON.stringify({
            type: "UPDATE",
            gameState,
        }));
    });
}

const broadcastDisconnect = (playerId) => {
    delete gameState.players[playerId];
    delete connections[playerId];
    Object.keys(connections).forEach((socketId) => {
        connections[socketId].send(JSON.stringify({
            type: "OPPONENT_DISCONNECTED",
            playerId,
            gameState,
        }));
    });
}

const broadCastProjectileFire = (projectileId) => {
    Object.keys(connections).forEach((socketId) => {
        connections[socketId].send(JSON.stringify({
            type: "PROJECTILE_FIRED",
            projectileId,
            gameState,
        }));
    }); 
}

webSocket.on("connection", (socket, req) => {
    const playerId = uuid.v4();

    connections[playerId] = socket;
    gameState.players[playerId] = {
        x:  Math.floor(Math.random() * 500),
        y: Math.floor(Math.random() * 500),
        xVelocity: 0,
        yVelocity: 0,
        width: 20, // default width and height
        height: 30,
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
            case("ACTION"):
                switch(message.action){
                    case("moveLeft"):
                        gameState.players[playerId].xVelocity = -2;
                        break;
                    case("stopMoveLeft"):
                        gameState.players[playerId].xVelocity = 0;
                        break;
                    case("moveRight"):
                        gameState.players[playerId].xVelocity = 2;
                        break;
                    case("stopMoveRight"):
                        gameState.players[playerId].xVelocity = 0;
                        break;
                    case("moveUp"):
                        gameState.players[playerId].yVelocity = -2;
                        break;
                    case("stopMoveUp"):
                        gameState.players[playerId].yVelocity = 0;
                        break;
                    case("moveDown"):
                        gameState.players[playerId].yVelocity = 2;
                        break;
                    case("stopMoveDown"):
                        gameState.players[playerId].yVelocity = 0;
                        break;
                    case("jump"):
                        gameState.players[playerId].yVelocity =  -16;
                        break;
                    case("fireLeft"):
                        console.log('recieved fire left')
                        const projectileId = uuid.v4();
                        const player = gameState.players[playerId];
                        const projectile  = {
                            x: player.x,
                            y: player.y,
                            xVelocity: -2,
                            yVelocity: 0,
                            width: 5, // default width and height
                            height: 5,
                            playerId,
                        }
                        gameState.projectiles[projectileId] = projectile;
                        broadCastProjectileFire(projectileId);
                        // Create projectile
                        break;
                    default:
                        break;
                }
            default:
                break;
        }
    });

    console.log(`received a connection, there are ${Object.keys(connections).length} connections`);
});

const gameLoop = () => {
    setTimeout(gameLoop, 1000/60);

    Object.keys(gameState.players).forEach((playerId) => {
        game.gravity(gameState, playerId);
        game.updatePlayerPosition(gameState, playerId)
    });

    Object.keys(gameState.projectiles).forEach((projectileId) => {
        game.updateProjectilePosition(gameState, projectileId)

    })
}

const serverLoop = () => {
    setTimeout(serverLoop, 1000/60);
    broadcastUpdate();
}


serverLoop();
gameLoop();