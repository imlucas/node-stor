function BackboneAdapter(store, ns){
  store.ns = ns  + '~';
  // normalize the api taxonomy with a convenience that returns the
  // correct function for a store.
  function getHandler(method){
    var taxonomy = {
        create: store.set,
        read: store.get,
        update: store.set,
        'delete': store.remove,
        patch: store.set,
        findAll: store.all,
        findById: store.get
      };
    return store[method] || taxonomy[method];
  }
  function sync(method, model, options){
    var args = [], store = store;

    if(Array.isArray(model.models)){
      // it's a collection, but backbone sends the same methods as models.
      method = 'all';
    }
    else {
      if(method === 'create' && !model.id){
        return store.id(function(err, id){
          model.id = id;
          model.set(model.idAttribute, id);
          sync(method, model, options);
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
    var handler = getHandler(method);
    if(!handler){
      throw new Error('No handler for ' + method + ' on ' + store.name);
    }
    handler.apply(handler, args);
  }
  return {sync: sync, store: store, ns: ns};
}

module.exports = function(store, ns){
  return new BackboneAdapter(store, ns);
};
