
// ======================== Entry point =========================== //
// ================================================================ //
const updatePlayerPosition = (gameState, playerId, frames) => {
    if (!gameState) return;
    const player = gameState.players[playerId];

    // Apply gravity
    if (player.yVelocity < 16){
        player.yVelocity += 1;
    }
        
    const x = player.x + player.xVelocity;
    const y = player.y + player.yVelocity;
    const collidedXEntities = collidedXPlayer(gameState, playerId, x);
    const collidedYEntities = collidedYPlayer(gameState, playerId, y);

    if (collidedXEntities.length == 0){
        player.x = x;
    } else {
        collidedXEntities.forEach((entity) => {
            collideX(player, entity);
        })
        
    }

    if (collidedYEntities.length == 0){
        gameState.players[playerId].y = y;
    } else {
        collidedYEntities.forEach((entity) => {
            collideY(player, entity);
        })
        // collideY(player, collidedYEntity);
    }
}

const updateProjectilePosition = (gameState, projectileId, frames) => {
    const projectile = gameState.projectiles[projectileId];

    // Apply gravity
    if (frames % 3 === 0){
        if (projectile.yVelocity < 16){
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
        collideX(projectile, collidedXEntity);
        projectile.xVelocity = 0;
    }

    if (!collidedYEntity){
        projectile.y = y;
    } else {
        collideY(projectile, collidedYEntity);
        projectile.yVelocity = 0;

    }
}

const collidedYProjectile = (gameState, projectileId, y) => {
    let collider = null;
    const projectile = gameState.projectiles[projectileId];
    collider = collidedPlatformY(gameState, projectile, y);

    let playerCollision = collidedPlayerY(gameState, projectile, y)
    if (playerCollision && playerCollision.id != projectile.playerId) {
        projectile.lifeTime = 0; // flag projectile for deletion
        playerCollision.health -= 5;
    }
    return collider;
}

const collidedXProjectile = (gameState, projectileId, x) => {
    let collider = null;
    const projectile = gameState.projectiles[projectileId];
    collider = collidedPlatformX(gameState, projectile, x)

    let playerCollision = collidedPlayerX(gameState, projectile, x)
    if (playerCollision && playerCollision.id != projectile.playerId) {
        projectile.lifeTime = 0; // flag projectile for deletion
        playerCollision.health -= 5;
    }

    return collider;
}

const collidedYPlayer = (gameState, playerId, y) => {
    const colliders = [];
    const player = gameState.players[playerId];

    const collidedPlatform = collidedPlatformY(gameState, player, y);
    const collidedPlayer = collidedPlayerY(gameState, player, y);

    if (collidedPlatform) colliders.push(collidedPlatform);
    if (collidedPlayer) colliders.push(collidedPlayer);
    
    return colliders;
}

const collidedXPlayer = (gameState, playerId, x) => {
    const colliders = [];
    const player = gameState.players[playerId];

    const collidedPlatform = collidedPlatformX(gameState, player, x);
    const collidedPlayer = collidedPlayerX(gameState, player, x);

    if (collidedPlatform) colliders.push(collidedPlatform);
    if (collidedPlayer) colliders.push(collidedPlayer);

    return colliders;
}









// ================= Helpers =============================== //
// ========================================================= //


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


module.exports = {
    updatePlayerPosition,
    updateProjectilePosition,
    // gravity,
}



