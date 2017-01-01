
function Entity (params, id, type){
  var self = {
    x: params.x,
    y: params.y,
    id: params.id || id || '',
    team: params.team,
    type: params.type || type || '',
    toRemove: false,
    toUpdate: true,
  }
  return self;
}
