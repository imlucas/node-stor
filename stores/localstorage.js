var debug = require('debug')('stor:localstorage'),
  assert = require('assert');

// Make local storage async, get and set JSON-ify.
function prostrate(source){
  return function(method, transform){
    transform = transform || {};
    return function(){
      var args = Array.prototype.slice.call(arguments, 0),
        fn = args.pop(),
        res,
        last;

      if(args[0] && ['removeItem', 'getItem', 'setItem'].indexOf(method) > -1){
        var id = args[0];
        id = id.toString();
        if(id.indexOf(module.exports.ns) === -1){
          id = module.exports.ns + id;
        }
        args[0] = id;
      }
      if(args.length == 2 && transform.before){
        args[1] = transform.before(args[1]);
      }
      if(method === 'key'){
        assert(typeof args[0] === 'number', args[0] + ' must be a number');
      }
      if(!source[method]){
        throw new Error('Unknown localstorage method ' + method);
      }
      else{
        if(source[method].apply){
          res = source[method].apply(source, args);
          debug('result for ' +  method, '(', args, ')', res);
        }
        else {
          res = source[method];
        }
      }

      try{
        if(transform.after){
          res = transform.after(res);
        }
      }
      catch(e){}
      fn(null, res);
    };
  };
}

var proxy = prostrate(window.localStorage);

module.exports = {
  binding: window.localStorage,
  ns: 'stor',
  name: 'localstorage',
  get: proxy('getItem', {after: JSON.parse}),
  set: proxy('setItem', {before: JSON.stringify}),
  remove: proxy('removeItem'),
  key: proxy('key'),
  clear: proxy('clear'),
  length: proxy('length'),
  all: function(fn){
    var store = module.exports;
    // debug('## localstorage key dump');
    // for ( var i = 0, len = localStorage.length; i < len; ++i ) {
    //   debug('  - ' + i + ' -> ' + localStorage.key(i));
    // }

    store.length(function(err, length){
      if(err) return fn(err);

      if(length === 0) return fn(null, []);

      var pending = length,
        docs = [];

      for(var i=0; i <length; i++){
        store.key(i, function(err, id){
          if(err) return fn(err);
          if(id.indexOf(store.ns) === -1){
            debug('  skip `' + id + '` because it does not begin with the ns `' + store.ns + '`');
            pending--;
            return;
          }
          store.get(id, function(err, doc){
            if(err) return fn(err);

            docs.push(doc);
            pending--;

            if(pending === 0){
              return fn(null, docs);
            }
          });
        });
      }
    });
  },
};
