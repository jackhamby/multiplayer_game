const WebSockets = require("ws");

const webSocket = new WebSockets.Server({
    port: 3000,
});

let clients = 0;
webSocket.on("connection", (socket, req) => {
    clients += 1;
    console.log('received a connection')
    socket.on("message", (message) => {
        console.log(`recieved message: ${message}`);
    });
    
    socket.send(JSON.stringify({
        player: clients,
    }));


});