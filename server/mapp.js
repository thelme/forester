var Base = require("./base.js").Base;
var Tree = require("./tree.js").Tree;

function Mapp(params){
  var self = {
    trees: {},
    bases: {},
    x_size : params.x_size,
    y_size : params.y_size,
    game : params.game,
    baseMarging : 20,
  }

  self.init = function(){
    console.log('[MAPP] Size (' + self.x_size + ' ' + self.y_size + ')');
    self.init_bases();
    self.init_trees();
  }

  self.init_bases = function(){
    console.log("[MAPP] init of " + self.game.n_team + " bases");
    switch ( self.game.n_team) {
      case 2:
        self.bases[0] = new Base({team: 0, x:self.baseMarging, y:self.baseMarging});
        self.bases[1] = new Base({team: 1, x:self.x_size-self.baseMarging, y:self.y_size-self.baseMarging});
        break;
      case 3:
        self.bases[0] = new Base({team: 0, x:self.baseMarging, y:self.baseMarging});
        self.bases[1] = new Base({team: 0, x:self.baseMarging, y:y_size-self.baseMarging});
        self.bases[2] = new Base({team: 1, x:self.x_size-self.baseMarging, y:self.y_size/2});
        break;
      case 4:
        self.bases[0] = new Base({team: 0, x:self.baseMarging, y:self.baseMarging});
        self.bases[1] = new Base({team: 1, x:self.baseMarging, y:self.y_size-self.baseMarging});
        self.bases[2] = new Base({team: 0, x:self.x_size-self.baseMarging, y:self.baseMarging});
        self.bases[3] = new Base({team: 1, x:self.x_size-self.baseMarging, y:self.y_size-self.baseMarging});
        break;
      default:
    }
  }

  self.init_trees = function(){
    console.log("[MAPP] init trees");
    var n_trees = 5;
    for(var i_base in self.bases){
      var base = self.bases[i_base];
      for(var i_tree = 0; i_tree < n_trees; i_tree++){
        var angle = 2*Math.PI*i_tree/n_trees;
        var x = base.x + self.baseMarging/2*Math.cos(angle);
        var y = base.y + self.baseMarging/2*Math.sin(angle);
        var a_new_tree = Tree({x: x, y: y, team: base.team, age:10});
        self.trees[a_new_tree.id] = a_new_tree;
      }
    }
  }

  self.update = function(){
    for(var key in self.trees){
      if (self.trees[key].toRemove){
        delete self.trees[key];
      } else {
        self.trees[key].update();
      }
    }
  }

  self.get_tree = function(coord){
    return self.trees[ coord.x + '_' + coord.y ];
  }
  
  self.add_a_tree = function(a_new_tree){
    self.trees[a_new_tree.id] = a_new_tree;
    self.trees[a_new_tree.id].toUpdate = true;
  }

  self.pack_trees_to_update = function(){
    var pack = [];
    for(var key in self.trees){
      var tree = self.trees[key];
      if (tree.toUpdate || tree.toRemove){
        pack.push(tree);
        tree.toUpdate = false;
      }
    }
    return pack;
  }

  return self;
}

module.exports.Mapp = Mapp;
