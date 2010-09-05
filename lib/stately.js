exports.define = function(states) {
  return new Stately(states);
};

// the default type handler
function getType(obj) {
  return obj.type;
}

// the default state handler
function getState(obj, cb) {
  cb(null, obj.state);
};

function Stately(states) {
  this.states = states || {};
  this.getState = getState;
  this.getType = getType;
};

Stately.prototype.handle = function(obj) {
  var self = this, states = this.states;
  this.getState(obj, function(er, state) {
    var type = self.getType(obj);
    if (type && states[type]) {
      if (states[type][state]) {
        states[type][state](obj);
      } else if (states[type]._default) {
        states[type]._default(obj);
      } else {
        if (states[state]) {
          states[state](obj);
        }
      }
    } else {
      if (states[state]) {
        states[state](obj);
      } else if (states._default) {
        states._default(obj);
      }
    }
  });
};
