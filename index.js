var debug = require('debug')('stor'),
  available = {},
  current = null;

module.exports.fs = require('./stores/fs');
module.exports.indexeddb = require('./stores/indexeddb');
module.exports.localstorage = require('./stores/localstorage');
module.exports.session = require('./stores/session');
module.exports.websql = require('./stores/websql');
module.exports.names = Object.keys(module.exports);

['indexeddb', 'localstorage', 'session'].map(function(name){
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

var adapters = {
  'backbone': require('./adapters/backbone')
};

module.exports.adapter = function(name, ns){
  return adapters[name](current, ns);
};

module.exports.use = function(name){
  if(!available[name]){
    throw new Error(name + ' is not available');
  }
  debug('switched store to ' + name);
  current = available[name];
  current.adapter = module.exports.adapter;
  return current;
};

['get', 'set', 'remove', 'key', 'clear', 'length'].map(function(method){
  module.exports[method] = function(){
    var args = Array.prototype.slice.call(arguments, 0);
    current[method].apply(current, args);
  };
});
