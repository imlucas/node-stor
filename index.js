var debug = require('debug')('stor'),
  available = {},
  current = null;

module.exports.fs = require('./stores/fs');
module.exports.indexeddb = require('./stores/indexeddb');
module.exports.localstorage = require('./stores/localstorage');
module.exports.websql = require('./stores/websql');

['indexeddb', 'localstorage'].map(function(name){
  var store = module.exports[name];
  debug('checking store binding for ' + name);
  if(!store.binding){
    return debug(name + ' binding unavailable');
  }
  available[name] = store;
  if(current === null){
    debug(name + ' will be used as the primary store');
    current = available[name];
  }
});

module.exports.use = function(name, fn){
  if(!available[name]){
    return fn(new Error(name + ' is not available'));
  }
  debug('switched store to ' + name);
  current = available[name];
  fn(null, current);
};

['get', 'set', 'remove', 'key', 'clear', 'length'].map(function(method){
  module.exports[method] = function(){
    var args = Array.prototype.slice.call(arguments, 0);
    current[method].apply(current, args);
  };
});
