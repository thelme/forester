function Player (params, drawerFoo){
  var self = Entity(params);
  self.drawer = drawerFoo;
  self.type = 'Player';

  self.draw = function() {
    fillStyles = {0:'#489edf', 1:'#d64e4e', 2:'#fbf22d', 3:'#eb84ff'};
    drawer(self.x, self.y, 2, 1, fillStyles[data.team], '#333333', 1) {)
  }

  return self;
}

Player.list = {};
