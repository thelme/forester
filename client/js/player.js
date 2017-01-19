function Player (params, drawerFoo, writerFoo){
  var self = Entity(params, drawerFoo);
  self.type = 'Player';
  self.writer = writerFoo;

  self.draw = function() {

    Scaler.my_scaler.setPosPlayerScreen(self);
    c = Scaler.my_scaler.mapp2screen(self);
    //console.log("Pos_screen_in_mapp : " + Scaler.my_scaler.pos_screen_in_mapp.x + ', ' + Scaler.my_scaler.pos_screen_in_mapp.y);
    //console.log("Player in map    : " + self.x + ", " + self.y);
    //console.log("Player in screen : " + c.x + ", " + c.y);
    self.writer(c.x-20, c.y, (self.x + ", " + self.y + '\n' + c.x + ", " + c.y) )
    fillStyles = {0:'#489edf', 1:'#d64e4e', 2:'#fbf22d', 3:'#eb84ff'};
    self.drawer(c.x, c.y, 2, 1, fillStyles[self.team], '#333333', 1 );
  }

  Player.list[self.id] = self;

  return self;
}

Player.list = {};
