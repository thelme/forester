var Entity = require("./entity.js").Entity;

function Tree (params){
  var self = Entity(params, (params.x + '_' + params.y), 'Tree');
  self.age = params.age || 0;
  self.ageMax = params.ageMax || 100;
  self.chopState = 0;
  self.resistance = 50;

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
