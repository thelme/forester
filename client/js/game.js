
console.log('Game file');

var ctxElem = document.getElementById("ctxId");
var ctx2D = ctxElem.getContext("2d");
ctx2D.font = '12px Arial';

var groundColor = '#ffffff';

var socket = io();
var waiterText = document.getElementById('waiter-text');

//===========================================================================[SIGN]
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');

console.log('T\'es passé par ici ?');
signDivSignIn.onclick = function(){
  console.log('sign In of ' + signDivUsername.value );
  socket.emit('signIn',{username:signDivUsername.value,password:signDivPassword.value});
}
signDivSignUp.onclick = function(){
  socket.emit('signUp',{username:signDivUsername.value,password:signDivPassword.value});
}
socket.on('signInResponse',function(data){
  if(data.success){
    signDiv.style.display = 'none';
    waitDiv.style.display = 'inline-block';
  } else {
    if (data.game_state == 0){
      alert("Bah nan, le pseudo est deja pris.");
    } else {
      alert("Game already began.");
    }
  }
});
socket.on('signUpResponse',function(data){
  if(data.success){
    alert("Sign up successul.");
  } else
    alert("Sign up unsuccessul.");
});

//===========================================================================[WAIT]
socket.on('players_ready',function(data){
  var myTab = '';
  myTab    = '<div>';
  myTab   += '<p> Press P if you are ready </p>';
  myTab   += '<div>';
  myTab   += '<table>';
  data.forEach(function(dataP){
    if (dataP.i == undefined){
      myTab += '<tr><td> ' + dataP.name + '</td>';
      myTab += '<td> ' + ((dataP.isReady==true)? 'Ready' : 'Waiting') + '</td></tr>';
    } else {
      myTab   += '<p> ' + dataP.i + ' </p>';
    }
  });
  myTab   += '</table>';
  waiterText.innerHTML = myTab;
});

var selfId = null;
//===========================================================================[GAME]
socket.on('start_game', function(data){
  console.log('Yolo');
  waitDiv.style.display = 'none';
  gameDiv.style.display = 'inline-block';
  document.title = 'Forester - ' + data.name + ' team : ' + data.team;
  selfId = data.id;
  gameStart();
});

document.onkeydown = function(event){
  var codes = {32: 'SPACE', 65:'A', 90:'Z', 69:'E', 82:'R', 80:'P'};
  var code = codes[event.keyCode];
  if(code !== undefined)
    socket.emit('keyPress',{inputId:code, state:true});
}
document.onkeyup = function(event){
  var codes = {32: 'SPACE', 65:'A', 90:'Z', 69:'E', 82:'R', 80:'P'};
  var code = codes[event.keyCode];
  if(code !== undefined)
    socket.emit('keyPress',{inputId:code, state:false});
}

var gameStart = function(){

  translateCoord = function(x, y){
    var rx = x - ctxElem.getBoundingClientRect().top;
    var ry = y - ctxElem.getBoundingClientRect().left;
    return {x: rx, y: ry};
  }

  document.onmousedown = function(event){
    var c = translateCoord(event.clientX, event.clientY);
    socket.emit('cmd', {inputId:'mouse', state:true, x: c.x, y: c.y});
  }
  document.onmouseup = function(event){
    socket.emit('cmd', {inputId:'mouse', state:false});
  }

  socket.on('init',function(data){
		if(data.selfId)
			selfId = data.selfId;
		for(var i = 0 ; i < data.player.length; i++){
			new Player(data.player[i], draw_circle);
		}
		for(var i = 0 ; i < data.tree.length; i++){
			new Tree(data.tree[i]);
		}
	});

	socket.on('update',function(data){
		//{ player : [{id:123,x:0,y:0},{id:1,x:0,y:0}], bullet: []}
		for(var i = 0 ; i < data.player.length; i++){
			var pack = data.player[i];
			var p = Player.list[pack.id];
			if(p){
				if(pack.x !== undefined)
					p.x = pack.x;
				if(pack.y !== undefined)
					p.y = pack.y;
			}
		}
		for(var i = 0 ; i < data.tree.length; i++){
			var pack = data.tree[i];
			var b = Tree.list[data.tree[i].id];
			if(b){
				if(pack.x !== undefined)
					b.x = pack.x;
				if(pack.y !== undefined)
					b.y = pack.y;
			}
		}
	});

	socket.on('remove',function(data){
		//{player:[12323],bullet:[12323,123123]}
		for(var i = 0 ; i < data.player.length; i++){
			delete Player.list[data.player[i]];
		}
		for(var i = 0 ; i < data.tree.length; i++){
			delete Tree.list[data.tree[i]];
		}
	});

  setInterval(function(){
  	if(!selfId)
  		return;
  	ctx.clearRect(0,0,500,500);
  	draw_background();
  	for(var i in Player.list)
  		Player.list[i].draw();
  	for(var i in Tree.list)
  		Tree.list[i].draw();
    },40);
}



draw_background = function() {
  ctx2D.save();
  ctx2D.clearRect(0,0,500,500);
  ctx2D.fillStyle = groundColor;
  ctx2D.fill();
  ctx2D.restore();
}

draw_circle = function(x, y, radius, purcent, fill, stroke, lineWidth) {
  ctx2D.save();
  ctx2D.beginPath();
  ctx2D.arc(x, y, radius, 0, 2*Math.PI*purcent, false);
  ctx2D.fillStyle = fill;
  ctx2D.fill();
  ctx2D.lineWidth = lineWidth;
  ctx2D.strokeStyle = stroke;
  ctx2D.stroke();
  ctx2D.restore();
}
