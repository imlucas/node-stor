// Make local storage async, get and set JSON-ify.
function prostrate(source){
  return function(method, transform){
    transform = transform || {};
    return function(){
      var args = Array.prototype.slice.call(arguments, 0),
        fn = args.pop(),
        res,
        last;

      if(args.length == 2 && transform.before){
        args[1] = transform.before(args[1]);
      }
      res = source[method].apply(source, args);

      if(transform.after){
        res = transform.after(res);
      }
      fn(null, res);
    };
  };
}

var proxy = prostrate(window.localStorage);

module.exports = {
  binding: window.localStorage,
  get: proxy('getItem', {after: JSON.parse}),
  set: proxy('setItem', {before: JSON.stringify}),
  remove: proxy('removeItem'),
  key: proxy('key'),
  clear: proxy('clear'),
  length: proxy('length')
};
