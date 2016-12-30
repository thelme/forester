
var Tree = require("./tree.js").Tree;

function Player (params){
  var self = {
    name: params.name || 'bob',
    team: params.team || -1,
    x: params.x || -1,
    y: params.y || -1,
    x_target: -1,
    y_target: -1,
    action: undefined,
    pressingMouse: false,
    mouseAngle: false,
    isReady: false,
    hp: 100,
    speed: 10,
    chopping: 1,
    distPlanting: 20,
    distChopping: 15,
    actionA: false,
    actionZ: false,
    actionE: false,
    actionR: false,
    type: 'Player',
    toUpdate: true,
    socket: params.socket,
    margingTop : 0,
    margingLeft : 0,
    whatIsOn : params.whatIsOn,
    add_a_tree: params.add_a_tree,
    get_tree: params.get_tree,
  }

  self.update = function(){
    if (self.action != undefined)
      self.action();
  }

  self.move = function(){
    if (self.socket != undefined){
      var dist = self.getDistance(self, {x: self.x_target, y: self.y_target});
      if (dist > self.speed){
        //var speed = (dist < self.speed) ? dist : self.speed;
        self.x += (self.speed*(self.x_target-self.x)/dist);
        self.y += (self.speed*(self.y_target-self.y)/dist);
        self.toUpdate = true;
        //self.socket.emit('update_player', {x: self.x, y: self.y});
      }
    }
  }

  self.plant = function(){
    if (self.socket != undefined){
      if (self.getDistance(self, {x: self.x_target, y: self.y_target}) < self.distPlanting){
        self.add_a_tree( new Tree({x: self.x_target, y: self.y_target, team: self.team, age:0}) );
        self.action = undefined;
      } else {
        self.move();
      }
    }
  }

  self.chop = function() {
    if (self.socket != undefined){
      var target = {x: self.x_target, y: self.y_target};
      if (self.getDistance(self, target) < self.distChopping){
        var the_tree = self.get_tree( target );
        console.log('Tree to chop : ' + the_tree.chopState);
        if (the_tree.chopState >= the_tree.resistance){
          the_tree.toRemove = true;
          //self.socket.emit('rm_tree', [the_tree]);
          self.action = undefined;
        } else {
          the_tree.chopState += self.chopping;
          the_tree.toUpdate = true;
          //self.socket.emit('update_tree', [the_tree]);
        }
      } else {
        self.move();
      }
    }
  }

  self.externaler = function() {
    return {name: self.name, team: self.team, x: self.x, y: self.y, toUpdate: self.toUpdate};
  }

  self.getDistance = function(e1, e2){
    var vx = e1.x - e2.x;
    var vy = e1.y - e2.y;
    return Math.sqrt(vx*vx+vy*vy);
  }

  self.translateCoord = function(coord){
    var x = coord.x - self.margingTop;
    var y = coord.y - self.margingLeft;
    return {x: x, y: y};
  }

  self.onConnect = function(){
    self.socket.on('canvas_params',function(data){
      self.margingTop  = data.top;
      self.margingLeft = data.left;
    });

  	self.socket.on('cmd', function(data) {
  		switch (data.inputId) {
  			case 'mouse':
          self.pressingMouse = data.state;
          if (data.state){
            self.x_target = self.translateCoord(data).x;
            self.y_target = self.translateCoord(data).y;
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
