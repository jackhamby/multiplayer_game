const updatePlayerPosition = (gameState, playerId, frames) => {
    if (!gameState) return;
    const player = gameState.players[playerId];

    // Apply gravity
    // if (frames % 5 === 0){
        if (player.yVelocity < 32){
            player.yVelocity += 1;
        }
    // }
    // gravity(player);
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

const updateProjectilePosition = (gameState, projectileId, frames) => {
    const projectile = gameState.projectiles[projectileId];
    // gravity(projectile);
    // Apply gravity every 10 frames
    if (frames % 3 === 0){
        if (projectile.yVelocity < 32){
            projectile.yVelocity += 1;
        }
    }
    const x = projectile.x + projectile.xVelocity;
    const y = projectile.y + projectile.yVelocity;
    const collidedXEntity = collidedXProjectile(gameState, projectileId, x);
    const collidedYEntity = collidedYProjectile(gameState, projectileId, y);

    if (!collidedXEntity){
        projectile.x = x;
    } else {
        // Set to left side
        if (projectile.x < collidedXEntity.x){
            projectile.x = collidedXEntity.x - projectile.width - 1;
        // set to right side
        } else {
            projectile.x = (collidedXEntity.x + collidedXEntity.width) + 1
        }
    }

    if (!collidedYEntity){
        projectile.y = y;
    } else {
        // Set to top of platform
        if (projectile.y < collidedYEntity.y){
            projectile.y = collidedYEntity.y - projectile.height - 1;
        // Set to bottom
        } else {
            projectile.y = (collidedYEntity.y + collidedYEntity.height) + 1
        }
    }

    // TODO add collision
    // projectile.x += projectile.xVelocity;
    // projectile.y += projectile.yVelocity;
}

// const gravity = (entity) => {

// }

const collidedYProjectile = (gameState, projectileId, y) => {
    let collider = null;

    Object.keys(gameState.platforms).forEach((platformId) => {
        const platform = gameState.platforms[platformId];
        const projectile = gameState.projectiles[projectileId];
        if ((projectile.x + projectile.width) >= platform.x &&
            projectile.x <= platform.x + platform.width &&
            (y + projectile.height) >= platform.y &&
            y <= platform.y + platform.height){
            collider =  platform;
        }
    });

    return collider
}

const collidedXProjectile = (gameState, projectileId, x) => {
    let collider = null;
    Object.keys(gameState.platforms).forEach((platformId) => {
        const platform = gameState.platforms[platformId];  
        const projectile = gameState.projectiles[projectileId];
        if ((x + projectile.width) >= platform.x &&
            x <= platform.x + platform.width &&
            (projectile.y + projectile.height) >= platform.y &&
            projectile.y <= platform.y + platform.height){
                collider = platform;
        }
    });
    return collider;

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
    // gravity,
}



