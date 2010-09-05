// the default type handler
function getType(obj, cb) {
  cb(obj.type);
}

// the default state handler
function getState(obj, cb) {
  cb(obj.state);
};

// the no-op before handler
function before(obj, cb) {cb(obj)};

exports.define = function(states) {
  states = states || {};
  states._getState = states._getState || getState;
  states._getType = states._getType || getType;
  states._before = states._before || before;
  function handle(obj) {
    states._before(obj, function(obj) {
      states._getType(obj, function(type) {
        states._getState(obj, function(state) {
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
      });
    });
  };
  return {
    handle : handle
  };
};
