var ctxElem = document.getElementById("ctxId");
var ctx2D = ctxElem.getContext("2d");
ctx2D.font = '12px Arial';


canvas = document.getElementById("ctxId");

var groundColor = '#ffffff';

//===========================================================================[THREE]
var container, stats;
var camera, scene, renderer;

var socket = io();
var waiterText = document.getElementById('waiter-text');


//https://github.com/mrdoob/three.js/blob/dev/examples/canvas_interactive_particles.html
//https://www.youtube.com/watch?v=Zpo4xcDHAL4

//===========================================================================[SIGN]
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');

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
document.onkeydown = function(event){
  if (signDiv.style.display != 'none' && event.keyCode == 13){
    document.getElementById('signDiv-signIn').click();
  }
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

var gameStarted = false;
socket.on('init',function(data){


	for(var i = 0 ; i < data.player.length; i++){
		new Player(data.player[i], draw_circle, write_test);
	}
	for(var i = 0 ; i < data.tree.length; i++){
		new Tree(data.tree[i], draw_circle);
	}

  waitDiv.style.display = 'none';
  gameDiv.style.display = 'inline-block';
  canvas.width  = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  if (data.size_mapp != undefined){
    console.log("Size mapp " + data.size_mapp.x + " " + data.size_mapp.y);
    Scaler.my_scaler = new Scaler({size_player_screen: {x: canvas.width, y: canvas.height}, size_mapp: data.size_mapp });
  }

	if(data.selfId){
		selfId = data.selfId;
    Scaler.my_scaler.setPosPlayerScreen(Player.list[data.selfId]);
    //document.title = 'Forester - ' + data.player[data.selfId].name + ' team : ' + data.player[data.selfId].team;
  }


  if (!gameStarted){
    gameStart();
    gameStarted = true;
  }

});

var gameStart = function(){

  translateCoord = function(x, y){
    var rx = x - ctxElem.getBoundingClientRect().top;
    var ry = y - ctxElem.getBoundingClientRect().left;
    return {x: rx, y: ry};
  }

  document.onmousedown = function(event){
    var c = translateCoord(event.clientX, event.clientY);
    c = Scaler.my_scaler.screen2mapp(c);
    socket.emit('cmd', {inputId:'mouse', state:true, x: c.x, y: c.y});
  }
  document.onmouseup = function(event){
    socket.emit('cmd', {inputId:'mouse', state:false});
  }

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
      console.log( i + ' Update de tree ' + pack.age + '\t = ' + pack.id );
			var b = Tree.list[pack.id];
			if(b){
				if(pack.x !== undefined)
					b.x = pack.x;
				if(pack.y !== undefined)
					b.y = pack.y;
				if(pack.age !== undefined)
					b.age = pack.age;
				if(pack.resistance !== undefined)
          b.resistance = pack.resistance;
				if(pack.chopState !== undefined)
          b.chopState = pack.chopState;
			}
		}
	});

	socket.on('remove',function(data){
		for(var i = 0 ; i < data.player.length; i++){
			delete Player.list[data.player[i].id];
		}
		for(var i = 0 ; i < data.tree.length; i++){
			delete Tree.list[data.tree[i].id];
		}
	});

}


setInterval(function(){
  if(!selfId)
  	return;

  //Scaler.my_scaler.movePosPlayerScreen(Player.list[selfId]);

  for(var i in Tree.list)
    Tree.list[i].update();

  draw_background();
  for(var i in Player.list)
  	Player.list[i].draw();
  for(var i in Tree.list)
  	Tree.list[i].draw();

},1000/25);

draw_background = function() {
  ctx2D.save();
  ctx2D.clearRect(0,0,canvas.width, canvas.height);
  ctx2D.fillStyle = groundColor;
  ctx2D.fill();
  ctx2D.restore();
}

write_test = function(x, y, data){
  ctx2D.save();
  ctx2D.fillText(data, x, y);
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
