function Tree (params){
  var self = {
    x: params.x,
    y: params.y,
    id: params.x + '_' + params.y,
    team: params.team,
    age: params.age || 0,
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

  self.grow = function(){
    self.age = (self.age < 10) ? self.age + 1 : self.age;
  }
  return self;
}


module.exports.Tree = Tree;
