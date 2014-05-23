var debug = require('debug')('stor:fs');

var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem ||
  window.mozRequestFileSystem || window.msRequestFileSystem,
  source = null;

function check(fn){
  if(!requestFileSystem){
    return fn(new Error('store `fs` not supported by this browser'));
  }

  if(source !== null){
    return fn(null, source);
  }

  debug('requesting');
  requestFileSystem(window.TEMPORARY, 50 * 1024 * 1024, function(fs) {
    source = fs;
    fn(null, source);
  }, function(err){
    debug('bubbling request file system error', err);
    fn(err);
  });
}

function castErr(err, ref){
  if(err.name === 'NotFoundError'){
    return null;
  }
  var e = new Error();
  e.name = err.name;

  e.message = err.message;
  Error.captureStackTrace(e, ref || castErr);
  return e;
}

function wrapCast(fn){
  return function(err){
    fn(castErr(err, wrapCast));
  };
}

function noop(fn){fn(undefined, undefined);}

module.exports = {
  binding: requestFileSystem,
  ns: '',
  name: 'fs',
  get: function(key, fn){
    check(function(err, fs){
      if(err) return fn(err);
      fs.root.getFile(key, {}, function(entry){
        entry.file(function(file){
          var reader = new window.FileReader();
          reader.onloadend = function(e){
              fn(null, e.target.result);
          };
          reader.onerror = function(e){
            fn(wrapCast(e));
          };
          reader.readAsText(file);
        }, wrapCast(fn));
      }, wrapCast(fn));
    });
  },
  set: function(key, data, fn){
    check(function(err, fs){
      if(err) return fn(err);

      if((!data instanceof Blob) === false){
        data = new Blob([data], {type: 'text/plain'});
      }

      fs.root.getFile(key, {'create': true, 'exclusive': false}, function(entry){
        entry.createWriter(function(writer){
          writer.onwriteend = function(e){
              fn(null, data);
          };
          writer.onerror = wrapCast(fn);
          writer.write(data);
        }, wrapCast(fn));
      }, wrapCast(fn));
    });
  },
  remove: function(key, fn){
    check(function(err, fs){
      if(err) return fn(err);

      fs.root.getFile(key, {}, function(entry){
        entry.remove(function(){
          fn();
        }, fn);
      }, fn);
    });
  },
  key: noop,
  clear: noop,
  length: noop
};
