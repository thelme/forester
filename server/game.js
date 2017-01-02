var Mapp = require("./mapp.js").Mapp;
var Player = require("./player.js").Player;

function Game(params){
  const WAIT4PLAYSERS = 0;
  const RUNNING = 1;
	var self = {
		id: params.id,
		name: params.name,
    n_team: params.n_team || 2,
    players: {},
    mapp : params.mapp,
    state: WAIT4PLAYSERS,
    i_all_ready : 50,
    io: params.io,
	}

  self.createMapp = function(){
    self.mapp = new Mapp( {x_size: 500, y_size: 500, game: self} );
  }

  self.init = function(){
    self.mapp.init();
    self.attributeTeam();
  }

  self.attributeTeam = function(){
    var i = -1;
    var n_by_team = Math.ceil( (Object.keys(self.players).length/self.n_team ) );
    //var i_by_team = {};
    for(var key in self.players){
      i++;
      var i_team = i%self.n_team;
      //i_by_team[i_team] += 1;
      //var angle = 2*Math.PI*i_by_team[i_team]/n_by_team;
      var x = self.mapp.bases[i_team].x; // + (2*self.mapp.baseMarging/3)*Math.cos(angle);
      var y = self.mapp.bases[i_team].y; // + (2*self.mapp.baseMarging/3)*Math.sin(angle);

      self.players[key].team = i_team;
      self.players[key].x = x;
      self.players[key].y = y;
      //console.log(self.players[key].name + ' team : ' + i_team + ' x : ' + x + ' y : ' + y);
    }
  }


  self.connect = function(data){
    console.log('[GAME] Hello ' + data.name );
    var functions = {whatIsOn: self.whatIsOn, add_a_tree:self.mapp.add_a_tree, get_tree:self.mapp.get_tree};
    self.players[data.socket.id] = new Player({}, data.name, data.socket, functions);
    self.players[data.socket.id].onConnect();
  }

  self.disconnect = function(id){
    console.log('[GAME] Bye bye ' + self.players[id].name);
    self.players[id].toRemove = true;
    if (Object.keys(self.players).length == 0){
      console.log('Il ne reste plus personne');
      self.state = WAIT4PLAYSERS;
    }
  }

  self.getDistance = function(e1, e2){
    var vx = e1.x - e2.x;
    var vy = e1.y - e2.y;
    return Math.sqrt(vx*vx+vy*vy);
  }

  self.whatIsOn = function(data){
    var retour = [];
    var distance = 5;
    //console.log('[GAME] whatIsOn (' + data.x + ' ' + data.y + ')' );
    for(var key in self.players){
      var p = self.players[key];
      if (self.getDistance(data, p) < distance){
        retour.push(p);
      }
    }
    for(var key in self.mapp.trees){
      var p = self.mapp.trees[key];
      if (self.getDistance(data, p) < distance){
        retour.push(p);
      }
    }
    // for(var key in self.mapp.bases){
    //   var p = self.mapp.bases[key];
    //   if (self.getDistance(data, p) < distance){
    //     retour.push(p);
    //   }
    // }
    //console.log(retour);
    return retour;
  }

  self.pack_players_to_update = function(){
    var pack = [];
    for(var key in self.players){
      var player = self.players[key];
      if (player.toUpdate){
        pack.push(player.externaler());
        player.toUpdate = false;
      }
    }
    return pack;
  }


  self.pack_players_to_remove = function(){
    var pack = [];
    for(var key in self.players){
      var player = self.players[key];
      if (player.toRemove){
        pack.push(player.externaler());
        player.toRemove = 2;
      }
    }
    return pack;
  }

  self.update_player = function(){
    for(var key in self.players){
      if (self.players[key].toRemove == 2){
        delete self.players[key];
      } else {
        self.players[key].update();
      }
    }
  }

  self.update = function(){
    if (self.state == RUNNING){
      if (Object.keys(self.players).length != 0){
        self.update_player();
        self.mapp.update();

        var pack_rm_player = self.pack_players_to_remove();
        var pack_rm_tree   = self.mapp.pack_trees_to_remove();

        var pack_update = {
      		player:self.pack_players_to_update(),
      		tree:self.mapp.pack_trees_to_update(),
      	}

        self.io.sockets.emit('update', pack_update);

        if (pack_remove_tree.length != 0 || pack_remove_player.length != 0)
          self.io.sockets.emit('remove', {player: pack_rm_tree, tree: pack_rm_tree});

      } else {
        self.state = WAIT4PLAYSERS;
      }
    } else if (self.state == WAIT4PLAYSERS){
  		if (Object.keys(self.players).length != 0){
  			var pack = [];
  			var all_ready = 1;
  			for(var key in self.players){
  				pack.push( {name: self.players[key].name, isReady: self.players[key].isReady} );
  				all_ready = (self.players[key].isReady) ? all_ready : 0;
  			}
  			if(all_ready != 0){
  				if (self.i_all_ready > 0){
  					self.i_all_ready -= 1;
  					pack.push( {i: self.i_all_ready } );
  				} else {
  					self.state = 1;

  					self.init();
            for (var key in self.players){
  					  self.players[key].socket.emit('start_game', {name: self.players[key].name, team:self.players[key].team, id:self.players[key].id});
            }
  				}
  			} else {
  				self.i_all_ready = 50;
  			}
        self.io.sockets.emit('players_ready', pack);
  		}
  	}
  }

  return self;
}

module.exports.Game = Game;
