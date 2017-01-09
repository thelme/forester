function Entity (params, drawerFoo){
  var self = {
    x: params.x,
    y: params.y,
    id: params.id,
    team: params.team,
    drawer: drawerFoo,
  }
  return self;
}
