var stor = require('../'),
  assert = require('assert');

describe('stor', function(){
  describe.skip('fs', function(){
    before(function(done){
      stor.fs.get('prime-all_the-fs', function(){
        done();
      });
    });

    var secret = new Date().toString();
    it('should read', function(done){
      stor.fs.get('today', function(err, data){
        if(err) return done(err);
        done();
      });
    });

    it('should write', function(done){
      stor.fs.set('today', secret, function(err, data){
        if(err) return done(err);
        assert((data instanceof Blob));

        done();
      });
    });

    it('should remove', function(done){
      stor.fs.remove('today', function(err, data){
        if(err) return done(err);
        done();
      });
    });
  });

  describe.skip('indexeddb', function(){
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

  describe('session', function(){
    var secret = new Date().toString();

    it('should read', function(done){
      stor.session.get('today', function(err, data){
        if(err) return done(err);
        done();
      });
    });
    it('should write', function(done){
      stor.session.set('today', secret, function(err, data){
        if(err) return done(err);

        done();
      });
    });
    it('should remove', function(done){
      stor.session.remove('today', function(err, data){
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

  describe('adapters', function(){
    describe('backbone', function(){
      var testBackend = stor.adapter('backbone', 'test');

      it('should be using the right store', function(){
        assert.equal(testBackend.store.name, 'localstorage');
      });
      it('should have the right ns', function(){
        assert.equal(testBackend.ns, 'test');
      });
    });
  });
});
