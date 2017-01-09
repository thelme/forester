function Tree (params, drawerFoo){
  var self = Entity(params, drawerFoo);
  self.age = params.age;
  self.ageMax = params.ageMax;
  self.chopState = params.chopState;
  self.resistance = params.resistance;
  self.type = 'Tree';

  self.draw = function() {
    fillStyles  = {0:'#489edf', 1:'#d64e4e', 2:'#fbf22d', 3:'#eb84ff'};
    strokeStyle = ( self.chopState == 0 ) ? '#84d055' : '#64a035';
    lineWidth   = ( self.chopState == 0 ) ? 2 : 3;
    self.drawer(self.x, self.y, 5, (self.age/self.ageMax), fillStyles[self.team], strokeStyle, lineWidth);
  }

  Tree.list[self.id] = self;

  return self;
}

Tree.list = {}
