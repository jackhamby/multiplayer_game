

var gameState = {
    players: {
        "<playerId>" :{
            x: 1,
            y: 1,
            xVelocity: 5,
            yVelocity: 5,
            width: 20,
            height: 20,
        }
    },
    projectiles: {
        "<projectileId>": {
            x: 1,
            y: 1,
            xVelocity: 5,
            yVelocity: 5,
            width: 10,
            height: 10,
            playerId: "<playerId>"   // This the player the projectile belongs to
        }
    }
    
}