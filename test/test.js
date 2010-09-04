// you can set as a listener on a stream
// it will callback the thing

var vows = require('vows')
  , assert = require('assert')
  , stately = require('../lib/stately')
  ;

vows.describe('Stately').addBatch({
  "very simple" : {
    topic : function() {
      var machine = stately.define({
        foo : function(obj) {
          obj.foo = 'bar';
        }
      });
      return machine;
    },
    "with a basic event" : {
      topic : function(machine) {
        var obj = {state : "foo"};
        machine.handle(obj);
        return obj;
      },
      "should get triggered" : function(obj) {
        assert.equal(obj.foo, 'bar');
      }
    }
  }
}).export(module);

