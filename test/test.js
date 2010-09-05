// you can set as a listener on a stream
// it will callback the thing

var vows = require('vows')
  , assert = require('assert')
  , stately = require('../lib/stately')
  ;

function runMachine(obj) {
  return function(machine) {
    machine.handle(obj);
    return obj;
  };
};

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
      topic : runMachine({state : "foo"}),
      "should get triggered" : function(obj) {
        assert.equal(obj.foo, 'bar');
      }
    },
    "with a non-matching state" : {
      topic : runMachine({state : "bam"}),
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
      topic : runMachine({
        type : "apple",
        state : "ripe"
      }),
      "should run" : function(obj) {
        assert.equal(obj.bite, "chomp");
      }
    },
    "with an obj that doesn't match" : {
      topic : runMachine({
        type : "banana",
        state : "ripe"
      }),
      "should not run" : function(obj) {
        assert.equal(obj.state, "ripe");
      }
    }
  },
  "with a default" : {
    topic : stately.define({
      foo : function(obj) {
        obj.foo = 'bar';
      },
      _default : function(obj) {
        obj.default_ran = true;
      }
    }),
    "with an obj that doesn't match" : {
      topic : runMachine({state : "nomatch"}),
      "should run the default" : function(obj) {
        assert.isTrue(obj.default_ran);
      }
    }
  },
  "with a typed default" : {
    topic : stately.define({
      apple : {
        ripe : function(apple) {
          apple.bite = "chomp";
        },
        _default : function(apple) {
          apple.apple_default_ran = true;
        }
      }
    }),
    "with a typed obj that doesn't match state" : {
      topic : runMachine({type:"apple",state : "nomatch"}),
      "should run the default" : function(obj) {
        assert.isTrue(obj.apple_default_ran);
      }
    },
    "with an untyped object" : {
      topic : runMachine({state : "nomatch"}),
      "should not run" : function(obj) {
        assert.isUndefined(obj.apple_default_ran);
      }
    }
  },
  "with a generic default and typed default" : {
    topic : stately.define({
      apple : {
        ripe : function(apple) {
          apple.bite = "chomp";
        },
        _default : function(apple) {
          apple.apple_default_ran = true;
        }
      },
      _default : function(obj) {
        obj.generic_default_ran = true;
      }
    }),
    "with a typed obj that doesn't match state" : {
      topic : runMachine({type:"apple",state : "nomatch"}),
      "should run the default" : function(obj) {
        assert.isTrue(obj.apple_default_ran);
      },
      "should not run the generic default" : function(obj) {
        assert.isUndefined(obj.generic_default_ran);
      }
    },
    "with an untyped object" : {
      topic : runMachine({state : "nomatch"}),
      "should run the generic default" : function(obj) {
        assert.isUndefined(obj.apple_default_ran);
        assert.isTrue(obj.generic_default_ran);
      }
    }
  },
  "with typed and untyped states" : {
    topic : stately.define({
      apple : {
        ripe : function(apple) {
          apple.bite = "chomp";
        }
      },
      ripe : function(obj) {
        obj.slice = "yum";
      },
      unripe : function(obj) {
        obj.eat = "later";
      }
    }),
    "with a matching type and state" : {
      topic : runMachine({type : "apple", state : "ripe"}),
      "should run the typed state" : function(obj) {
        assert.equal(obj.bite, "chomp");
      },
      "should not run the untyped state" : function(obj) {
        assert.isUndefined(obj.slice);
      }
    },
    "with a mismatched type" : {
      topic : runMachine({type : "banana", state : "ripe"}),
      "should not run the untyped state" : function(obj) {
        assert.equal(obj.slice, "yum");
      }
    },
    "with a matching type but generic state" : {
      topic : runMachine({type : "apple", state : "unripe"}),
      "should run the generic state handler" : function(obj) {
        assert.equal(obj.eat, "later");
      }
    }
  },
  "with typed and untyped states and a typed default handler" : {
    topic : stately.define({
      apple : {
        ripe : function(apple) {
          apple.bite = "chomp";
        },
        _default : function(apple) {
          apple.juggle_it = "why not";
        }
      },
      ripe : function(obj) {
        obj.slice = "yum";
      },
      unripe : function(obj) {
        obj.eat = "later";
      }
    }),
    "with a matching type but generic state" : {
      topic : runMachine({type : "apple", state : "unripe"}),
      "should not run the generic state handler" : function(obj) {
        assert.isUndefined(obj.eat);
      },
      "should run the typed default" : function(apple) {
        assert.equal(apple.juggle_it, "why not");
      }
    }
  },
  "very simple with a before" : {
    topic : function() {
      var machine = stately.define({
        _before : function(obj, cb) {
          cb(obj.core);
        },
        foo : function(obj) {
          obj.foo = 'bar';
        }
      });
      return machine;
    },
    "with a matching state" : {
      topic : runMachine({core : {state : "foo"}}),
      "should get triggered" : function(obj) {
        assert.equal(obj.core.foo, 'bar');
      }
    },
    "with a non-matching state" : {
      topic : runMachine({state : "foo", core:{state : "bam"}}),
      "should not run" : function(obj) {
        assert.isUndefined(obj.foo);
        assert.isUndefined(obj.core.foo);
      }
    }
  },
}).export(module);

