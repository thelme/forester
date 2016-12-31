function Tree (params){
  var self = {
    x: params.x,
    y: params.y,
    id: params.x + '_' + params.y,
    team: params.team,
    age: params.age || 0,
    ageMax: params.ageMax || 100,
    chopState: 0,
    resistance: 50,
    toRemove: false,
    type: 'Tree',
    toUpdate: true,
  }

  self.idByCoord = function(coord){
    return coord.x + '_' + coord.y;
  }

  self.update = function(){
    self.grow();
  }

  self.chop = function(chopping){
    self.chopState += chopping;
    self.toUpdate = true;
    self.toRemove = (self.chopState >= self.resistance);
  }

  self.grow = function(){
    if (self.age < self.ageMax) {
      self.age += 1;
      self.toUpdate = true;
    }
  }
  return self;
}


module.exports.Tree = Tree;
