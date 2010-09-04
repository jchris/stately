exports.define = function(states) {
  return new Stately(states);
};

// the default type handler
function getType(obj) {
  return obj.type;
}


// the default state handler
function getState(obj) {
  return obj.state;
};

function Stately(states) {
  this.states = states;
  this.getState = getState;
  this.getType = getType;
};

Stately.prototype.handle = function(obj) {
  var state = this.getState(obj)
    , type = this.getType(obj)
    ;
  if (type) {
    return this.states[type] && this.states[type][state] && this.states[type][state](obj);
  } else {
    return this.states[state] && this.states[state](obj);    
  }
};
