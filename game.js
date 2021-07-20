
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
    const collidedYPlatform = collidedY(gameState, playerId, y);
    const collidedXPlatform = collidedX(gameState, playerId, x);

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

const gravity = (gameState, playerId) => {
    if (gameState[playerId].yVelocity < 16){
            gameState[playerId].yVelocity += 1;
    }
}


const collidedY = (gameState, playerId, y) => {
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

const collidedX = (gameState, playerId, x) => {
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


