//app.js
var express = require('express');
var app = express();
var uuid = require('uuid');
var Game = require("./server/game.js").Game;
var Mapp = require("./server/mapp.js").Mapp;
var Base = require("./server/base.js").Base;
var Tree = require("./server/tree.js").Tree;
var Player = require("./server/player.js").Player;
var serv = require('http').Server(app);
var io = require('socket.io')(serv,{});

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.get('/js/:file',function(req, res) {
	res.sendFile(__dirname + '/client/js/' + req.params.file);
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server started.");

var a_game = new Game( {id: uuid.v4(), name: 'blabla', io: io} );
a_game.createMapp();

var isUsernameTaken = function(data,cb){
	if (data.username == ''){
		cb(false);
	} else {
		var isTaken = false;
		for(var key in a_game.players){
			if (a_game.players[key].name == data.username){
				isTaken = true;
			}
		}
		cb(isTaken);
	}
}

io.sockets.on('connection', function(socket){

	socket.on('signIn',function(data){
		console.log('Helloooo');
		//isValidPassword(data,function(res){
		//	if(res){
		isUsernameTaken(data,function(res){
			if(!res && a_game.state == 0){
				socket.emit('signInResponse',{success:true});
				a_game.connect({name: data.username, socket: socket});

				socket.on('disconnect',function(){
					a_game.disconnect( socket.id );
				});

			} else {
				socket.emit('signInResponse',{success:false, game_state: a_game.state});
			}
		});
	});

	// socket.on('signUp',function(data){
	// 	isUsernameTaken(data,function(res){
	// 		if(res){
	// 			socket.emit('signUpResponse',{success:false});
	// 		} else {
	// 			addUser(data,function(){
	// 				socket.emit('signUpResponse',{success:true});
	// 			});
	// 		}
	// 	});



});

setInterval(function(){
	a_game.update();
},1000/25);
