const updatePlayerPosition = (gameState, playerId) => {
    if (!gameState) return;
    const player = gameState.players[playerId];
    gravity(player);
    const x = player.x + player.xVelocity;
    const y = player.y + player.yVelocity;
    const collidedXEntity = collidedX(gameState, playerId, x);
    const collidedYEntity = collidedY(gameState, playerId, y);

    if (!collidedXEntity){
        player.x = x;
    } else {
        // Set to left side
        if (player.x < collidedXEntity.x){
            player.x = collidedXEntity.x - player.width - 1;
        // set to right side
        } else {
            player.x = (collidedXEntity.x + collidedXEntity.width) + 1
        }
    }

    if (!collidedYEntity){
        gameState.players[playerId].y = y;
    } else {
        // Set to top of platform
        if (player.y < collidedYEntity.y){
            player.y = collidedYEntity.y - player.height - 1;
        // Set to bottom
        } else {
            player.y = (collidedYEntity.y + collidedYEntity.height) + 1
        }
    }
}

const updateProjectilePosition = (gameState, projectileId) => {
    const projectile = gameState.projectiles[projectileId];
    gravity(projectile);

    // TODO add collision
    projectile.x += projectile.xVelocity;
    projectile.y += projectile.yVelocity;
}

const gravity = (entity) => {
    if (entity.yVelocity < 16){
        entity.yVelocity += 1;
    }
}

const collidedY = (gameState, playerId, y) => {
    let collider = null;

    Object.keys(gameState.platforms).forEach((platformId) => {
        const platform = gameState.platforms[platformId];
        const player = gameState.players[playerId];
        if ((player.x + player.width) >= platform.x &&
            player.x <= platform.x + platform.width &&
            (y + player.height) >= platform.y &&
            y <= platform.y + platform.height){
            collider =  platform;
        }
    });
  
    Object.keys(gameState.players).forEach((enemyPlayerId) => {
        if (enemyPlayerId === playerId) return;
        const enemyPlayer = gameState.players[enemyPlayerId];
        const player = gameState.players[playerId];
        if ((player.x + player.width) >= enemyPlayer.x &&
            player.x <= enemyPlayer.x + enemyPlayer.width &&
            (y + player.height) >= enemyPlayer.y &&
            y <= enemyPlayer.y + enemyPlayer.height){
            collider = enemyPlayer;
        }
    });

    return collider
}

const collidedX = (gameState, playerId, x) => {
    let collider = null;
    Object.keys(gameState.platforms).forEach((platformId) => {
        const platform = gameState.platforms[platformId];  
        const player = gameState.players[playerId];
        if ((x + player.width) >= platform.x &&
            x <= platform.x + platform.width &&
            (player.y + player.height) >= platform.y &&
            player.y <= platform.y + platform.height){
                collider = platform;
        }
    });

    Object.keys(gameState.players).forEach((enemyPlayerId) => {
        if (enemyPlayerId === playerId) return;
        const enemyPlayer = gameState.players[enemyPlayerId];
        const player = gameState.players[playerId];
        if ((x + player.width) >= enemyPlayer.x &&
            x <= enemyPlayer.x + enemyPlayer.width &&
            (player.y + player.height) >= enemyPlayer.y &&
            player.y <= enemyPlayer.y + enemyPlayer.height){
                collider = enemyPlayer;
        }
    });

    return collider
}

module.exports = {
    updatePlayerPosition,
    updateProjectilePosition,
    gravity,
}



