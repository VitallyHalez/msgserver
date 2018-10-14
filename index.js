var WebSocketServer = require("ws").Server
var express = require("express")
var http = require("http")
var app = express()
var port = process.env.PORT || 5000
var server = http.createServer(app)
app.use(express.static(__dirname + "/"))
server.listen(port)
var wss = new WebSocketServer({server: server})

var clients = {};

wss.on("connection", function(ws) {
    let id = 'client' + randomInteger(100000, 999999);
    clients[id] = ws;

    ws.on('message', function(message) {
        message = JSON.parse(message);
        
        if (message.method === "msgtoserver") {
            method = JSON.stringify({method: "msgtoclient", msg: message.msg});
        }

        else if (message.method === "exmpltoserver") {
            method = JSON.stringify({game: ['example', 'data'], method:'exmplonclient'});
        }
        
        else { return; }
        
        clients.forEach(client => {
            if(client != ws)
                client.send(method);
        });
    });
    
    ws.on('close', function() {
        clients.forEach(client => {
            delete client;
        });
    });
})

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}