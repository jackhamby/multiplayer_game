
const updatePlayerPosition = (gameState, playerId, frames) => {
    if (!gameState) return;
    const player = gameState.players[playerId];

    // Apply gravity
        if (player.yVelocity < 200){
            player.yVelocity += 1;
        }
    // gravity(player);
    const x = player.x + player.xVelocity;
    const y = player.y + player.yVelocity;
    const collidedX = collidedXPlayer(gameState, playerId, x);
    const collidedY = collidedYPlayer(gameState, playerId, y);

    let collidedRightNextToX;
    let collidedRightNextToY;
    if (player.xVelocity > 0){
        collidedRightNextToX = collidedXPlayer(gameState, playerId, player.x + 5);
    } else if (player.xVelocity < 0) {
        collidedRightNextToX = collidedXPlayer(gameState, playerId, player.x - 5);
    }
    if (player.yVelocity > 0){
        collidedRightNextToY = collidedYPlayer(gameState, playerId, player.y + 5)
    
    }
    else if (player.yVelocity < 0 ){
        collidedRightNextToY = collidedYPlayer(gameState, playerId, player.y - 5)
    }

    // if (!collidedX)  player.x = x;
    // if (!collidedY) player.y = y;
    if (collidedRightNextToY && player.yVelocity > 50){
        console.log("collided right next to y")
    }
    if (!collidedX && !collidedRightNextToX)  player.x = x;
    if (!collidedY && !collidedRightNextToY)  player.y = y;
}


const updateProjectilePosition = (gameState, projectileId, frames) => {
    // const projectile = gameState.projectiles[projectileId];
    // // gravity(projectile);
    // // Apply gravity every 10 frames
    // if (frames % 3 === 0){
    //     if (projectile.yVelocity < 32){
    //         projectile.yVelocity += 1;
    //     }
    // }
    // const x = projectile.x + projectile.xVelocity;
    // const y = projectile.y + projectile.yVelocity;
    // const collidedXEntity = collidedXProjectile(gameState, projectileId, x);
    // const collidedYEntity = collidedYProjectile(gameState, projectileId, y);
}





const collidedPlatformX = (gameState, entity, x) => {
    let collider;
    Object.keys(gameState.platforms).forEach((platformId) => {
        const platform = gameState.platforms[platformId];  
        // const player = gameState.players[playerId];
        if ((x + entity.width) >= platform.x &&
            x <= platform.x + platform.width &&
            (entity.y + entity.height) >= platform.y &&
            entity.y <= platform.y + platform.height){
                collider = platform;
        }
    });
    return collider;
}

const collidedPlatformY = (gameState, entity, y) => {
    let collider;
    Object.keys(gameState.platforms).forEach((platformId) => {
        const platform = gameState.platforms[platformId];
        if ((entity.x + entity.width) >= platform.x &&
            entity.x <= platform.x + platform.width &&
            (y + entity.height) >= platform.y &&
            y <= platform.y + platform.height){
            collider =  platform;
        }
    });
    return collider;
}

const collidedPlayerX = (gameState, entity, x) => {
    let collider;
    Object.keys(gameState.players).forEach((enemyPlayerId) => {
        if (enemyPlayerId === entity.id) return; // TODO do we do this here
        const enemyPlayer = gameState.players[enemyPlayerId];
        if ((x + entity.width) >= enemyPlayer.x &&
            x <= enemyPlayer.x + enemyPlayer.width &&
            (entity.y + entity.height) >= enemyPlayer.y &&
            entity.y <= enemyPlayer.y + enemyPlayer.height){
                collider = enemyPlayer;
        }
    });
    return collider;
}

const collidedPlayerY = (gameState, entity, y) => {
    let collider;

    Object.keys(gameState.players).forEach((enemyPlayerId) => {
        if (enemyPlayerId === entity.id) return; // TODO do we do this here
        const enemyPlayer = gameState.players[enemyPlayerId];
        if ((entity.x + entity.width) >= enemyPlayer.x &&
            entity.x <= enemyPlayer.x + enemyPlayer.width &&
            (y + entity.height) >= enemyPlayer.y &&
            y <= enemyPlayer.y + enemyPlayer.height){
            collider = enemyPlayer;
        }
    });

    return collider;

}









const collidedYProjectile = (gameState, projectileId, y) => {
    let collider = null;
    const projectile = gameState.projectiles[projectileId];

    collider = collidedPlatformY(gameState, projectile, y)

    return !!collider
}

const collidedXProjectile = (gameState, projectileId, x) => {
    let collider = null;
    const projectile = gameState.projectiles[projectileId];

    collider = collidedPlatformX(gameState, projectile, x);
    
    return !!collider;
}


// Returns true if playerId collided in y
// false if no collisions
const collidedYPlayer = (gameState, playerId, y) => {
    let collider = null;
    const player = gameState.players[playerId];

    const collidedPlatform = collidedPlatformY(gameState, player, y);
    // if(collidedPlatform) collideY(player, collidedPlatform)
    if (collidedPlatform) {
        collideY(player, collidedPlatform);
        // return true;
    }

    const collidedPlayer = collidedPlayerY(gameState, player, y);
    if (collidedPlayer) collideY(player, collidedPlayer);

    return collidedPlatform || collidedPlayer;
}

// Returns true if playerId collided in x
// false if no collisions
const collidedXPlayer = (gameState, playerId, x) => {
    const player = gameState.players[playerId];

    
    const collidedPlatform = collidedPlatformX(gameState, player, x);
    if (collidedPlatform) collideX(player, collidedPlatform);

    const collidedPlayer = collidedPlayerX(gameState, player, x);
    if (collidedPlayer) collideX(player, collidedPlayer);


    return collidedPlatform || collidedPlayer;
}






const collideY = (entity1, entity2) => {
    // Set to top of platform
    if (entity1.y < entity2.y){
        entity1.y = entity2.y - entity1.height - 1;
    // Set to bottom
    } else {
        debugger;
        entity1.y = (entity2.y + entity2.height) + 1
    }
}

const collideX = (entity1, entity2) => {
    // Set to left side
    if (entity1.x < entity2.x){
        entity1.x = entity2.x - entity1.width - 1;
    // set to right side
    } else {
        entity1.x = (entity2.x + entity2.width) + 1
    }
}

module.exports = {
    updatePlayerPosition,
    updateProjectilePosition,
    // gravity,
}