var debug = require('debug')('stor:session');

function prostrate(source){
  return function(method, transform){
    transform = transform || {};

    var wrapped = function(){
      var args = Array.prototype.slice.call(arguments, 0),
        fn = args.pop(),
        res,
        real = window.sessionStorage[method];

      if(args.length === 2 && transform.before){
        args[1] = transform.before(args[1]);
      }

      if(args[0] && ['removeItem', 'getItem', 'setItem'].indexOf(method) > -1){
        var id = args[0];
        id = id.toString();
        if(id.indexOf(sesh.ns) === -1){
          id = sesh.ns + '~' + id;
          debug('applied ns', id);
        }
        args[0] = id;
      }

      if(typeof real === 'function'){
        res = real.apply(source, args);
      }
      else {
        res = window.sessionStorage[method];
      }

      try{
        if(transform.after){
          debug('running after transform', transform.after);
          res = transform.after(res);
        }
      }
      catch(e){
        debug('could not transform', res);
      }
      debug(method + ' result', res);
      fn(null, res);
    };

    return wrapped;
  };
}

var proxy = prostrate(window.sessionStorage);

var sesh = {
  binding: window.sessionStorage,
  ns: 'stor',
  get: proxy('getItem', {after: JSON.parse}),
  set: proxy('setItem', {before: JSON.stringify}),
  remove: proxy('removeItem'),
  key: proxy('key'),
  clear: proxy('clear'),
  length: proxy('length'),
  all: function(fn){
    debug('all called');
    var store = module.exports;
    store.length(function(err, length){
      if(err) return fn(err);

      if(length === 0) return fn(null, []);

      var pending = length,
        docs = [];

      for(var i=0; i <length; i++){
        store.key(i, function(err, id){
          if(err) return fn(err);

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
  // normalize the api taxonomy with a convenience that returns the
  // correct function for a store.
  handler: function(method){
    var fn, store = sesh,
          taxonomy = {
          create: store.set,
          read: store.get,
          update: store.set,
          'delete': store.remove,
          patch: store.set,
          findAll: store.all,
          findById: store.get
        };

    fn = store[method] || taxonomy[method];
    return fn;
  },
  id: function(fn){
    sesh.length(function(err, length){
      fn(null, length + 1);
    });
  },
  name: 'session'
};

module.exports = sesh;
