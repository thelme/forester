function Scaler (params){
  var self = {
    size_mapp : params.size_mapp,
    coef_screen2mapp : 1./10.,
    coord_player_in_mapp : params.coord_player_in_mapp,
    size_player_screen : params.size_player_screen,
    pos_screen_in_mapp : {x: 0, y: 0},
  }

  self.screen2mapp = function(coord_in_screen){
    return {x : coord_in_screen.x*self.coef_screen2mapp + self.pos_screen_in_mapp.x,
            y : coord_in_screen.y*self.coef_screen2mapp + self.pos_screen_in_mapp.y};
  }

  self.mapp2screen = function(coord_in_mapp){
    return {x : (1./self.coef_screen2mapp) * ( coord_in_mapp.x - self.pos_screen_in_mapp.x),
            y : (1./self.coef_screen2mapp) * ( coord_in_mapp.y - self.pos_screen_in_mapp.y)};
  }

  self.movePosPlayerScreen = function(coord_player_in_mapp){
    if ( self.pos_screen_in_mapp == undefined)
      return;

    self.coord_player_in_mapp = coord_player_in_mapp;
    coord_player_in_screen = self.mapp2screen(coord_player_in_mapp);
    size_screen_in_mapp = self.screen2mapp(self.size_player_screen);
    coord_ext_screen_in_mapp = {x: size_screen_in_mapp.x + self.pos_screen_in_mapp.x,
                                y: size_screen_in_mapp.y + self.pos_screen_in_mapp.y}

    if ( (self.pos_screen_in_mapp.x > 0) && ( coord_player_in_screen.x < self.size_player_screen.x/3 ) ){
      self.pos_screen_in_mapp.x ++;
    }
    if ( (self.pos_screen_in_mapp.x < coord_ext_screen_in_mapp.x) && ( coord_player_in_screen.x > 2*self.size_player_screen.x/3 ) ){
      self.pos_screen_in_mapp.x --;
    }
    if ( (self.pos_screen_in_mapp.y > 0) && ( coord_player_in_screen.y < self.size_player_screen.y/3 ) ){
      self.pos_screen_in_mapp.y ++;
    }
    if ( (self.pos_screen_in_mapp.y < coord_ext_screen_in_mapp.y) && ( coord_player_in_screen.y > 2*self.size_player_screen.y/3 ) ){
      self.pos_screen_in_mapp.y --;
    }
  }

  self.setPosPlayerScreen = function(coord_player_in_mapp){
    self.coord_player_in_mapp = coord_player_in_mapp;
    coord_player_in_screen = self.mapp2screen(coord_player_in_mapp);
    size_screen_in_mapp = self.screen2mapp(self.size_player_screen);
    size_mid_screen_in_mapp = {x: size_screen_in_mapp.x/2,
                              y: size_screen_in_mapp.y/2};

    if (coord_player_in_mapp.x < size_mid_screen_in_mapp.x){
      self.pos_screen_in_mapp.x = 0;
    } else if (coord_player_in_mapp.x > self.size_mapp.x - size_mid_screen_in_mapp.x){
      self.pos_screen_in_mapp.x = self.size_mapp.x - size_screen_in_mapp.x;
    } else {
      self.pos_screen_in_mapp.x = coord_player_in_mapp.x - size_mid_screen_in_mapp.x;
    }

    if (coord_player_in_mapp.y < size_mid_screen_in_mapp.y){
      self.pos_screen_in_mapp.y = 0;
    } else if (coord_player_in_mapp.y > self.size_mapp.y - size_mid_screen_in_mapp.y ){
      self.pos_screen_in_mapp.y = self.size_mapp.y - size_screen_in_mapp.y;
    } else {
      self.pos_screen_in_mapp.y = coord_player_in_mapp.y - size_mid_screen_in_mapp.y;
    }

  }

  return self;
}

Scaler.my_scaler = undefined;
