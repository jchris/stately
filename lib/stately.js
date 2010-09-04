exports.define = function(states) {
  return new Stately(states);
};

// the default state handler
function getState(obj) {
  return obj.state;
};

function Stately(states) {
  this.states = states;
  this.getState = getState;
};

Stately.prototype.handle = function(obj) {
  var state = this.getState(obj);
  return this.states[state](obj);
};
