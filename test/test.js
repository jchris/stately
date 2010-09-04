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
    "with a matching state" : {
      topic : function(machine) {
        var obj = {state : "foo"};
        machine.handle(obj);
        return obj;
      },
      "should get triggered" : function(obj) {
        assert.equal(obj.foo, 'bar');
      }
    },
    "with a non-matching state" : {
      topic : function(machine) {
        var obj = {state : "bam"};
        machine.handle(obj);
        return obj;
      },
      "should not run" : function(obj) {
        assert.equal(obj.state, 'bam');
      }
    }
  },
  "with types and states" : {
    topic : function() {
      return stately.define({
        apple : {
          ripe : function(apple) {
            apple.bite = "chomp";
          }
        }
      });
    },
    "with an obj that matches" : {
      topic : function(machine) {
        var obj = {
          type : "apple",
          state : "ripe"
        };
        machine.handle(obj);
        return obj;
      },
      "should run" : function(obj) {
        assert.equal(obj.bite, "chomp");
      }
    },
    "with an obj that doesn't match" : {
      
    }
  }
}).export(module);

