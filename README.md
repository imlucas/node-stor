# stor

[![build status](https://secure.travis-ci.org/imlucas/node-stor.png)](http://travis-ci.org/imlucas/node-stor)

Figure out the best option for storing things in the browser and do it.

## Example
```
// @todo: add a not ridiculous example
var stor = require('stor/stor.set('actor', {username: 'yolo17'}, function(err){
  stor.get('actor', function(err, actor){
    console.log(actor);
  });
});
```

## Docs

### stor.get(`key`, `fn`)

### stor.set(`key`, `value`, `fn`)

### stor.remove(`key`, `fn`)

### stor.key(`n`, `fn`)

Backwards compat for `localStorage.key`.  Get the key value in the store at
position `n`.

### stor.length(`fn`)

### stor.clear(`fn`)

### stor.use(`name`)

Manually switch to a different backend

### stor.use(`name`).adapter(`adapter`, `ns`)

Get an adapter for your framework of choice.

## Adapters

### Backbone

```javascript
var Backbone = require('backbone');
var sessionStorage = require('stor').use('session');
var historyBackend = sessionStorage.adapter('backbone', 'history');
var History = Backbone.Collection.extend({
  sync: historyBackend.sync
});
```

## Todo

- [ ] proper api for applying partial updates like Backbone's patch method.
- [ ] id generation
- [ ] namespace support in all stores translated where needed (eg localstorage -> use prefix, indexeddb -> use table name)

## License

MIT
