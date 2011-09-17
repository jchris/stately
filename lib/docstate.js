var follow = require("follow")
    , stately = require("stately")
    ;

exports.control = function(url) {
    var feed = new follow.Feed({db : url})
        , safeMachine, safeStates = {}
        , cautiousMachine, unsafeStates = {}
        ;
    
    feed.include_docs = true;
    
    feed.on("change", function(change) {
        // if (change.doc.type && change.doc.state) 
        //     console.log(change.doc.type, change.doc.state)
        handle(change.doc);
    });


    function logFun(obj, cb) {
        console.log(obj.type, obj.state)
        cb(obj)
    };
    
    
    debug = true;
    function makeMachines() {
        if (debug) {
            safeStates._before = logFun;
            unsafeStates._before = logFun;
        }
        safeMachine = safeMachine || stately.define(safeStates);
        cautiousMachine = cautiousMachine || stately.define(unsafeStates);
    };
    
    function handle(doc) {
        makeMachines();
        safeMachine.handle(doc);
        cautiousMachine.handle(doc);
    };
    
    function start() {
        makeMachines();
        feed.follow();
    }
    
    function registerSafeCallback(type, state, cb) {
        safeStates[type] = safeStates[type] || {};
        safeStates[type][state] = cb;
    }
    
    function registerUnsafeCallback(type, state, cb) {
        // todo this needs expiring lock
        unsafeStates[type] = unsafeStates[type] || {};
        unsafeStates[type][state] = cb;
    }
    
    return {
        start : start,
        safe : registerSafeCallback,
        unsafe : registerUnsafeCallback,
        handle : handle
    };
};
