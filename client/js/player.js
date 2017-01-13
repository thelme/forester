function Player (params, drawerFoo){
  var self = Entity(params, drawerFoo);
  self.type = 'Player';

  self.draw = function() {

    c = my_scaler.mapp2screen(self);

    fillStyles = {0:'#489edf', 1:'#d64e4e', 2:'#fbf22d', 3:'#eb84ff'};
    self.drawer(c.x, c.y, 2, 1, fillStyles[self.team], '#333333', 1 );
  }

  Player.list[self.id] = self;

  return self;
}

Player.list = {};
