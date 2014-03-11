'use strict';

require('debug').enable('*');

var stor = require('../'),
  assert = require('assert');

describe('stor', function(){
  describe('fs', function(){
    before(function(done){
      stor.fs.get('prime-all_the-fs', function(){
        done();
      });
    });
    var secret = 'console.log("hi there.  "' + Math.random() + ')';

    it('should read', function(done){
      stor.fs.get('hello.js', function(err, data){
        if(err) return done(err);
        done();
      });
    });

    it('should write', function(done){
      stor.fs.set('hello.js', secret, function(err, data){
        if(err) return done(err);
        assert((data instanceof Blob));

        done();
      });
    });

    it('should remove', function(done){
      stor.fs.remove('hello.js', function(err, data){
        if(err) return done(err);
        done();
      });
    });
  });

  describe('indexeddb', function(){
    var secret = new Date().toString();

    it('should read', function(done){
      stor.indexeddb.get('today', function(err, data){
        if(err) return done(err);
        done();
      });
    });

    it('should write', function(done){
      stor.indexeddb.set('today', secret, function(err, data){
        if(err) return done(err);
        done();
      });
    });

    it('should remove', function(done){
      stor.indexeddb.remove('today', function(err, data){
        if(err) return done(err);
        done();
      });
    });
  });

  describe('localstorage', function(){
    var secret = new Date().toString();

    it('should read', function(done){
      stor.localstorage.get('today', function(err, data){
        if(err) return done(err);
        done();
      });
    });
    it('should write', function(done){
      stor.localstorage.set('today', secret, function(err, data){
        if(err) return done(err);

        done();
      });
    });
    it('should remove', function(done){
      stor.localstorage.remove('today', function(err, data){
        if(err) return done(err);
        done();
      });
    });
  });

  describe('websql', function(){
    var secret = new Date().toString();

    it('should read', function(done){
      stor.websql.get('today', function(err, data){
        if(err) return done(err);
        done();
      });
    });

    it('should write', function(done){
      stor.websql.set('today', secret, function(err, data){
        if(err) return done(err);

        done();
      });
    });

    it('should remove', function(done){
      stor.websql.remove('today', function(err, data){
        if(err) return done(err);
        done();
      });
    });
  });

  describe('any', function(){
    var secret = new Date().toString();

    it('should read', function(done){
      stor.get('today', function(err, data){
        if(err) return done(err);
        done();
      });
    });

    it('should write', function(done){
      stor.set('today', secret, function(err, data){
        if(err) return done(err);

        done();
      });
    });

    it('should remove', function(done){
      stor.remove('today', function(err, data){
        if(err) return done(err);
        done();
      });
    });
  });
});
