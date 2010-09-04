exports.define = function(states) {
  return new Stately(states);
};


function Stately(states) {
  this.states = states;
};

Stately.prototype.handle = function(obj) {
  
};