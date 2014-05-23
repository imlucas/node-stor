function BackboneAdapter(store, ns){
  store.ns = ns  + '~';
  this.store = store;
  this.ns = ns;
}

BackboneAdapter.prototype.sync = function(method, model, options){
  var args = [], self = this, store = this.store;

  if(Array.isArray(model.models)){
    // it's a collection, but backbone sends the same methods as models.
    method = 'all';
  }
  else {
    if(method === 'create' && !model.id){
      return store.id(function(err, id){
        model.id = id;
        model.set(model.idAttribute, id);
        self.sync(method, model, options);
      });
    }
    args.push(model.id);

    if(['create', 'update', 'patch'].indexOf(method) > -1){
      args.push(model.toJSON());
    }
  }
  args.push(function(err, data){
    if(err) return options.error(err);
    options.success(data);
  });

  store.handler(method).apply(this, args);
};

module.exports = function(store, ns){
  return new BackboneAdapter(store, ns);
};
