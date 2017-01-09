
function Tree (params){
  var self = {
    type: 'Tree',
    x: params.x || -1,
    y: params.y || -1,
    id: params.id || (params.x + '_' + params.y) || '',
    team: params.team || -1,
    age: params.age || 0,
    ageMax: params.ageMax || 100,
    chopState: 0,
    resistance: 50,
    toUpdate: true,
    toRemove: false,
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

  self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			team:self.team,
			age:self.age,
			ageMax:self.ageMax,
			chopState:self.chopState,
			resistance:self.resistance,
		};
	}

	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			age:self.age,
			chopState:self.chopState,
		}
	}

  self.grow = function(){
    if (self.age < self.ageMax) {
      self.age += 1;
      if (self.age == self.ageMax){
        self.toUpdate = true;
      }
    }
  }
  return self;
}


module.exports.Tree = Tree;
