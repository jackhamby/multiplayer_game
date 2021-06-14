const WebSockets = require("ws");

const webSocket = new WebSockets.Server({
    port: 3000,
});

const connections = [];

const gameState = {
    
}


webSocket.on("connection", (socket, req) => {
    console.log('received a connection');
    const playerNumber = connections.length;
    // Tell other connections new player
    connections.forEach((sock) => {
        sock.send("another player connected");
    })
    // Add to connection list
    connections.push(socket)

    // Update gamestate with new client
    gameState[playerNumber] = {
        x: playerNumber === 0 ? 120 : 260, // 0th player at x: 120, 1st player at x: 260
        y: 360  
    }

    // Tell client which player they are
    socket.send(JSON.stringify({
        player: playerNumber,
    }));

    // socket.on("message", (message) => {
    //     console.log(`recieved message: ${message}`);
    // });

    // socket.on("close", (code, reason) => {

    // });
    console.log(gameState)
});