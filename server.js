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

let playerWidth = 20;
let playerHeight = 20;
const platforms = [];
platforms.push({
    x: 100,
    y: 400,
    width: 300,
    height: 50
}, {
    x: 250,
    y: 350,
    width: 50,
    height: 50,
});

const broadcastUpdate = () => {
    Object.keys(gameState).forEach((socketId) => {
        connections[socketId].send(JSON.stringify({
            type: "UPDATE",
            gameState,
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
        xVelocity: 0,
        yVelocity: 0,
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
                        gameState[playerId].xVelocity = -2;
                        break;
                    case("stopMoveLeft"):
                        gameState[playerId].xVelocity = 0;
                        break;
                    case("moveRight"):
                        gameState[playerId].xVelocity = 2;
                        break;
                    case("stopMoveRight"):
                        gameState[playerId].xVelocity = 0;
                        break;
                    case("moveUp"):
                        gameState[playerId].yVelocity = -2;
                        break;
                    case("stopMoveUp"):
                        gameState[playerId].yVelocity = 0;
                        break;
                    case("moveDown"):
                        gameState[playerId].yVelocity = 2;
                        break;
                    case("stopMoveDown"):
                        gameState[playerId].yVelocity = 0;
                        break;
                    case("jump"):
                        gameState[playerId].yVelocity =  -16;
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


const updateGameState = (playerId, x, y) => {
    const collidedYPlatform = collidedY(playerId, y);
    const collidedXPlatform = collidedX(playerId, x);

    if (!collidedXPlatform){
        gameState[playerId].x = x;
    } else {
        // Set to left side
        if (gameState[playerId].x < collidedXPlatform.x){
            gameState[playerId].x = collidedXPlatform.x - playerWidth - 1;
        // set to right side
        } else {
            gameState[playerId].x = (collidedXPlatform.x + collidedXPlatform.width) + 1
        }
    }

    if (!collidedYPlatform){
        gameState[playerId].y = y;
    } else {
        // Set to top of platform
        if (gameState[playerId].y < collidedYPlatform.y){
            gameState[playerId].y = collidedYPlatform.y - playerHeight - 1;
        // Set to bottom
        } else {
            gameState[playerId].y = (collidedYPlatform.y + collidedYPlatform.height) + 1
        }
    }
}

const collidedY = (playerId, y) => {
    for (let platform of platforms){
        if ((gameState[playerId].x + playerWidth) >= platform.x &&
            gameState[playerId].x <= platform.x + platform.width &&
            (y + playerHeight) >= platform.y &&
            y <= platform.y + platform.height){
                return platform;
            }
    }
    return null
}

const collidedX = (playerId, x) => {
    for (let platform of platforms){
        if ((x + playerWidth) >= platform.x &&
            x <= platform.x + platform.width &&
            (gameState[playerId].y + playerHeight) >= platform.y &&
            gameState[playerId].y <= platform.y + platform.height){
                return platform;
            }
    }
    return null
}

const gravity = (playerId) => {
    if (gameState[playerId].yVelocity < 16){
            gameState[playerId].yVelocity += 1;
    }
}

const gameLoop = () => {
    setTimeout(gameLoop, 1000/10);
    // if player is not moving dont send updates 
    
    Object.keys(gameState).forEach((playerId) => {
        gravity(playerId);
        if (gameState[playerId].xVelocity === 0 && gameState[playerId].yVelocity === 0){
            return;
        }
        // update player based on their velocity
        updateGameState(playerId, gameState[playerId].x + gameState[playerId].xVelocity, gameState[playerId].y + gameState[playerId].yVelocity)
    });
    broadcastUpdate();
}


gameLoop();