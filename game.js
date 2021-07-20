const playerWidth = 20;
const playerHeight = 20;
const platforms = [
    {
        x: 100,
        y: 400,
        width: 300,
        height: 50
    }, 
    {
        x: 250,
        y: 350,
        width: 50,
        height: 50,
    }
];

const updateGameState = (gameState, playerId, x, y) => {
    if (!gameState) return;
    const collidedXEntity = collidedX(gameState, playerId, x);
    const collidedYEntity = collidedY(gameState, playerId, y);

    if (!collidedXEntity){
        gameState[playerId].x = x;
    } else {
        // Set to left side
        if (gameState[playerId].x < collidedXEntity.x){
            gameState[playerId].x = collidedXEntity.x - playerWidth - 1;
        // set to right side
        } else {
            gameState[playerId].x = (collidedXEntity.x + collidedXEntity.width) + 1
        }
    }

    if (!collidedYEntity){
        gameState[playerId].y = y;
    } else {
        // Set to top of platform
        if (gameState[playerId].y < collidedYEntity.y){
            gameState[playerId].y = collidedYEntity.y - playerHeight - 1;
        // Set to bottom
        } else {
            gameState[playerId].y = (collidedYEntity.y + collidedYEntity.height) + 1
        }
    }
}

const gravity = (gameState, playerId) => {
    if (gameState[playerId].yVelocity < 16){
            gameState[playerId].yVelocity += 1;
    }
}

const collidedY = (gameState, playerId, y) => {
    for (let platform of platforms){
        if ((gameState[playerId].x + gameState[playerId].width) >= platform.x &&
            gameState[playerId].x <= platform.x + platform.width &&
            (y + gameState[playerId].height) >= platform.y &&
            y <= platform.y + platform.height){
                return platform;
            }
    }
    let collider = null;
    Object.keys(gameState).forEach((enemyPlayerId) => {
        if (enemyPlayerId === playerId) return;
        if ((gameState[playerId].x + gameState[playerId].width) >= gameState[enemyPlayerId].x &&
            gameState[playerId].x <= gameState[enemyPlayerId].x + gameState[enemyPlayerId].width &&
            (y + gameState[playerId].height) >= gameState[enemyPlayerId].y &&
            y <= gameState[enemyPlayerId].y + gameState[enemyPlayerId].height){
                console.log('collided x!')

                collider = gameState[enemyPlayerId];
            }
    });

    return collider
}

const collidedX = (gameState, playerId, x) => {
    for (let platform of platforms){
        if ((x + gameState[playerId].width) >= platform.x &&
            x <= platform.x + platform.width &&
            (gameState[playerId].y + gameState[playerId].height) >= platform.y &&
            gameState[playerId].y <= platform.y + platform.height){
                return platform;
            }
    }

    let collider = null;
    Object.keys(gameState).forEach((enemyPlayerId) => {
        if (enemyPlayerId === playerId) return;
        if ((x + gameState[playerId].width) >= gameState[enemyPlayerId].x &&
            x <= gameState[enemyPlayerId].x + gameState[enemyPlayerId].width &&
            (gameState[playerId].y + gameState[playerId].height) >= gameState[enemyPlayerId].y &&
            gameState[playerId].y <= gameState[enemyPlayerId].y + gameState[enemyPlayerId].height){
                console.log('collided y!')
            collider = gameState[enemyPlayerId];
        }
    });

    return collider
}

// This is a hack so we can import in both
// server and client.
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        // constants
        playerWidth,
        playerHeight,
        platforms,
    
        // functions
        updateGameState,
        gravity,
    }
}


