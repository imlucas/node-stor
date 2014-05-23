// Initialize IndexedDB; fall back to vendor-prefixed versions if needed.
var indexedDB = window.indexedDB || window.webkitIndexedDB ||
  window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
  source = null;

// Wrapper function that handles creating or acquiring the object store
// if it hasn't been already.
function db(op, fn){
  if(!indexedDB){
    return fn(new Error('store `indexeddb` not supported by this browser'));
  }
  if(typeof op === 'function'){
    fn = op;
    op = 'readwrite';
  }

  if(source !== null){
    return fn(null, source.transaction(module.exports.prefix, op).objectStore(module.exports.prefix));
  }
  var req = indexedDB.open(module.exports.prefix, 1);
  req.onerror = function(e){
    fn(e);
  };
  req.onupgradeneeded = function(){
    // First time setup: create an empty object store
    req.result.createObjectStore(module.exports.prefix);
  };
  req.onsuccess = function() {
    source = req.result;
    db(op, fn);
  };
}

module.exports = {
  binding: indexedDB,
  ns: 'stor',
  name: 'indexeddb',
  get: function(key, fn){
    db('readonly', function(err, store){
      var req = store.get(key);
      req.onsuccess = function(){
          fn(null, req.result || null);
      };
      req.onerror = function(){
        fn(req.error);
      };
    });
  },
  set: function(key, value, fn){
    db(function(err, store){
      var req = store.put(value, key);
      req.onsuccess = function(){
          fn();
      };
      req.onerror = function(){
          fn(req.error);
      };
    });
  },
  remove: function(key, fn){
    db(function(err, store){
      var req = store['delete'](key);
      req.onsuccess = function(){
          fn();
      };
      req.onerror = function(){
          fn(req.error);
      };
    });
  },
  key: function(n, fn){
    db('readonly', function(err, store){
      var advanced = false,
        req = store.openCursor();

      req.onsuccess = function(){
          var cursor = req.result;
          if (!cursor) {
            fn(new Error('Out of room for keys'));
          }
          else if(n === 0){
            fn(null, cursor.key);
          }
          else if(advanced === false){
            // Seek ahead `n` rows, which shittly calls this closure
            // again instead of just taking it's own callback.
            advanced = true;
            cursor.advance(n);
          }
          else {
            fn(null, cursor.key);
          }
      };
      req.onerror = function keyOnError() {
          fn(req.error);
      };
    });
  },
  clear: function(key, fn){
    db(function(err, store){
      var req = store.clear();
      req.onsuccess = function(){
          fn();
      };
      req.onerror = function(){
          fn(req.error);
      };
    });
  },
  length: function(fn){
    db('readonly', function(err, store){
      var req = store.count();
      req.onsuccess = function(){
          fn(null, req.result || 0);
      };
      req.onerror = function(){
        fn(req.error);
      };
    });
  }
};
