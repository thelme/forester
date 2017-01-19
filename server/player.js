var Tree = require("./tree.js").Tree;

function Player (params, name, socket, functions){
  var self = {
    type: 'Player',
    x: params.x || -1,
    y: params.y || -1,
    id: params.id  || socket.id  || '',
    team: params.team || -1,
    name : name,
    socket : socket,
    whatIsOn  : functions.whatIsOn,
    add_a_tree : functions.add_a_tree,
    get_tree : functions.get_tree,
    toRemove: false,
    toUpdate: true,
    x_target : -1,
    y_target : -1,
    action : undefined,
    pressingMouse : false,
    mouseAngle : false,
    isReady : false,
    hp : 100,
    speed : 0.1,
    chopping : 1,
    distPlanting : 3,
    distChopping : 2,
    actionA : false,
    actionZ : false,
    actionE : false,
    actionR : false,
  }

  self.update = function(){
    if (self.action != undefined)
      self.action();
  }

  self.move = function(){
    var dist = self.getDistance(self, {x: self.x_target, y: self.y_target});
    if (dist > self.speed){
      //var speed = (dist < self.speed) ? dist : self.speed;
      self.x += (self.speed*(self.x_target-self.x)/dist);
      self.y += (self.speed*(self.y_target-self.y)/dist);
      self.toUpdate = true;
      //self.socket.emit('update_player'; {x: self.x; y: self.y});
    }
  }

  self.plant = function(){
    if (self.getDistance(self, {x: self.x_target, y: self.y_target}) < self.distPlanting){
      self.add_a_tree( new Tree({x: self.x_target, y: self.y_target, team: self.team, age:0}) );
      self.action = undefined;
    } else {
      self.move();
    }
  }

  self.chop = function() {
    var target = {x: self.x_target, y: self.y_target};
    if (self.getDistance(self, target) < self.distChopping){
      var tree_target = self.get_tree( target );
      if (tree_target != undefined){
        tree_target.chop( self.chopping );
      } else {
        self.action = undefined;
      }
    } else {
      self.move();
    }
  }

  self.getDistance = function(e1, e2){
    var vx = e1.x - e2.x;
    var vy = e1.y - e2.y;
    return Math.sqrt(vx*vx+vy*vy);
  }

  self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			name:self.name,
			team:self.team,
		};
	}

	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
      toUpdate: self.toUpdate,
		}
	}

  self.onConnect = function(){

  	self.socket.on('cmd', function(data) {
  		switch (data.inputId) {
  			case 'mouse':
          self.pressingMouse = data.state;
          if (data.state){
            self.x_target = data.x;
            self.y_target = data.y;
            var targets = self.whatIsOn({x: self.x_target, y: self.y_target});
            if (targets.length >= 1){
              self.x_target = targets[0].x;
              self.y_target = targets[0].y;
              if (targets[0].type == 'Tree'){
                self.action = self.chop;
                console.log('A Tree');
              } else if (targets[0].type == 'Player') {
                console.log('A player');
              }
            } else if (self.actionA){
              self.action = self.plant;
            } else if (self.actionZ) {
              //TODO
            } else if (self.actionE) {
              //TODO
            } else if (self.actionR) {
              //TODO
            } else if (targets.length == 0){
              self.action = self.move;
            } else {
              self.action = undefined;
            }
          }
  				break;
  			default:
  		}
  	})
    self.socket.on('keyPress', function(data){
      switch (data.inputId) {
        case 'A':
          self.actionA = data.state;
          break;
        case 'Z':
          self.actionZ = data.state;
          break;
        case 'E':
          self.actionE = data.state;
          break;
        case 'R':
          self.actionR = data.state;
          break;
        case 'P':
          if (data.state){
            self.isReady = (self.isReady) ? false : true;
            console.log('[PLAYER] ' + self.name + ' is ' + ((self.isReady) ? '' : 'not ') + 'ready');
          }
          break;
        case 'SCPACE':
          break;
        default:

      }
    })
  }

  return self;
}




module.exports.Player = Player;
