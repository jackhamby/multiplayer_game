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
    height: 25
}

gameState.platforms[uuid.v4()] = {
    x: 250,
    y: 350,
    width: 25,
    height: 50,
}

gameState.platforms[uuid.v4()] = {
    x: 300,
    y: 250,
    width: 100,
    height: 25,
}

gameState.platforms[uuid.v4()] = {
    x: 425,
    y: 650,
    width: 400,
    height: 25,
}


gameState.platforms[uuid.v4()] = {
    x: 450,
    y: 560,
    width: 300,
    height: 25,
}

gameState.platforms[uuid.v4()] = {
    x: 450,
    y: 450,
    width: 225,
    height: 25,
}

gameState.platforms[uuid.v4()] = {
    x: 450,
    y: 450,
    width: 25,
    height: 125,
}

gameState.platforms[uuid.v4()] = {
    x: 725,
    y: 450,
    width: 25,
    height: 125,
}

gameState.platforms[uuid.v4()] = {
    x: 50,
    y: 200,
    width: 25,
    height: 150
}


// right box
gameState.platforms[uuid.v4()] = {
    x: 450,
    y: 560,
    width: 300,
    height: 25,
}

gameState.platforms[uuid.v4()] = {
    x: 450,
    y: 450,
    width: 225,
    height: 25,
}

gameState.platforms[uuid.v4()] = {
    x: 450,
    y: 450,
    width: 25,
    height: 125,
}

gameState.platforms[uuid.v4()] = {
    x: 725,
    y: 450,
    width: 25,
    height: 125,
}

gameState.platforms[uuid.v4()] = {
    x: 500,
    y: 350,
    width: 25,
    height: 100,
}




// upper box
gameState.platforms[uuid.v4()] = {
    x: 0,
    y: 0,
    width: 300,
    height: 25,
}


gameState.platforms[uuid.v4()] = {
    x: 0,
    y: 100,
    width: 225,
    height: 25,
}

gameState.platforms[uuid.v4()] = {
    x: 0,
    y: 0,
    width: 25,
    height: 125,
}

gameState.platforms[uuid.v4()] = {
    x: 275,
    y: 0,
    width: 25,
    height: 125,
}


// upper platform
gameState.platforms[uuid.v4()] = {
    x: 400,
    y: 50,
    width: 250,
    height: 25,
}

gameState.platforms[uuid.v4()] = {
    x: 450,
    y: 175,
    width: 250,
    height: 25,
}

gameState.platforms[uuid.v4()] = {
    x: 100,
    y: 475,
    width: 25,
    height: 75,
}





gameState.platforms[uuid.v4()] = {
    x: 0,
    y: 700,
    width: 350,
    height: 25,
}


gameState.platforms[uuid.v4()] = {
    x: 0,
    y: 550,
    width: 200,
    height: 25,
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

const broadCastProjectileDestroy = (projectileId) => {
    Object.keys(connections).forEach((socketId) => {
        connections[socketId].send(JSON.stringify({
            type: "PROJECTILE_DESTROYED",
            projectileId,
            gameState,
        }));
    }); 
}

const broadcastPlayerDeath = (playerId) => {
    delete gameState.players[playerId];
    Object.keys(connections).forEach((socketId) => {
        connections[socketId].send(JSON.stringify({
            type: "PLAYER_KILLED",
            playerId,
            gameState,
        }));
    }); 
}


const createPlatform = (x, y, width, height) => {
    const id = uuid.v4();
    const platform = {
        x,
        y,
        width,
        height,
        id,
    }
    gameState.projectiles[id] = platform;
}

const createProjectile = (playerId, xVelocity, yVelocity) => {
    const id = uuid.v4();
    const player = gameState.players[playerId];
    const projectile  = {
        lifeTime: 300, // default lifetime in frames
        x: player.x,
        y: player.y,
        xVelocity,
        yVelocity,
        width: 5, // default width and height
        height: 5,
        playerId,
        id,
    }
    gameState.projectiles[id] = projectile;
    broadCastProjectileFire(id);
}

const createPlayer = (playerId) => {
    return {
        x:  Math.floor(Math.random() * 500),
        y: Math.floor(Math.random() * 500),
        xVelocity: 0,
        yVelocity: 0,
        width: 20, // default width and height
        height: 30,
        health: 100, // default health
        maxHealth: 100,
        id: playerId,
    };
}

webSocket.on("connection", (socket, req) => {
    const playerId = uuid.v4();
    connections[playerId] = socket;
    gameState.players[playerId] = createPlayer(playerId);

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
        if (!gameState.players[playerId]) return;
        let message;
        try {
            message = JSON.parse(data);
        }
        catch {
            return;
        }
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
                        createProjectile(playerId, -16, 0)
                        // Create projectile
                        break;
                    case("fireRight"):
                        console.log('recieved fire right')
                        createProjectile(playerId, 16, 0)
                        // Create projectile
                        break;
                    case("fireUp"):
                        console.log('recieved fire up')
                        createProjectile(playerId, 0, -16)
                        // Create projectile
                        break;
                    case("fireDown"):
                        console.log('recieved fire down')
                        createProjectile(playerId, 0, 16)
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

let frames = 0
const gameLoop = () => {
    if (frames === Number.MAX_SAFE_INTEGER) frames = 0;

    setTimeout(gameLoop, 1000/60);

    Object.keys(gameState.players).forEach((playerId) => {
        // game.gravity(gameState, playerId);
        const player = gameState.players[playerId];
        if (player.health <= 0){
            broadcastPlayerDeath(playerId);
            // connections[playerId].close();
            // delete connections[playerId];

            return;
        }
        game.updatePlayerPosition(gameState, playerId, frames)
    });

    Object.keys(gameState.projectiles).forEach((projectileId) => {
        game.updateProjectilePosition(gameState, projectileId, frames);
        const projectile = gameState.projectiles[projectileId];
        projectile.lifeTime -= 1;
        if (projectile.lifeTime <= 0){
            delete gameState.projectiles[projectileId];
            broadCastProjectileDestroy(projectileId);
        }
    });

    ++frames;
}

const serverLoop = () => {
    setTimeout(serverLoop, 1000/60);
    broadcastUpdate();
}

createPlatform(100, 400, 300, 50);
createPlatform(250, 350, 50, 50);

serverLoop();
gameLoop();