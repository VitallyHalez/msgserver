var WebSocketServer = require("ws").Server
var express = require("express")
var http = require("http")
var app = express()
var port = process.env.PORT || 5000
var server = http.createServer(app)
app.use(express.static(__dirname + "/"))
server.listen(port)
var wss = new WebSocketServer({server: server})

var clients = {}

wss.on("connection", function(ws) {
    clients['id'] = ws 
    ws.on('message', function(message) {
        message = JSON.parse(message);
        
        if (message.method === "example to server") {
            method = JSON.stringify({method: "example to client" });
        }

        else if (message.method === "exmpltoserver") {
            method = JSON.stringify({game: ['example', 'data'], method:'exmplonclient'});
        }
        
        else { return; }
        
        clients.forEach(client => {
            client.send(method);
        });
    });
    
    ws.on('close', function() {
        clients.forEach(client => {
            client.send(method);
        });
    });
})