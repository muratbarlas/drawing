//back end code

console.log("My server is running")

var express = require('express');

var app = express();

//var server = app.listen(3000);
var port = process.env.PORT || 3000;
var server = app.listen(port);

app.use(express.static('public'));

var socket = require ('socket.io');

//create variable that keeps track of inputs and outputs
var io = socket(server);

//set up connection event
io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log("new connection! " + socket.id);

    socket.on('laserBeams', mouseMsg);
    socket.on('stars', starMsg);

    function mouseMsg(data){
        //console.log(data);
        socket.broadcast.emit('laserBeams', data) //sends data to all the windows
    }

    function starMsg(data){
        socket.broadcast.emit('stars', data)
    }
}