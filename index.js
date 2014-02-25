var debug = require('debug')('stor'),
  available = {},
  current = null;

Object.keys(['indexeddb', 'localstorage']).map(function(name){
  var store = require('./stores/' + name);
  if(!!store.binding){
    return debug(name + ' binding unavailable');
  }
  available[name] = store;
  if(current === null){
    current = available[name];
  }
});

module.exports.use = function(name, fn){
  if(!available[name]){
    return fn(new Error(name + ' is not available'));
  }
  current = available[name];
  fn(null, current);
};

['get', 'set', 'remove', 'key', 'clear', 'length'].map(function(method){
  module.exports[method] = function(){
    var args = Array.prototype.slice.call(arguments, 0);
    current[method].apply(current, args);
  };
});
