var binding = window.openDatabase,
    db = (binding) ? binding('stor', '1.0', 'stor', 4980736) : null;

if(db){
  db.transaction(function (t) {
    t.executeSql('CREATE TABLE IF NOT EXISTS stor ' +
      '(id INTEGER PRIMARY KEY, key unique, value)');
  });
}

function run(){
  var args = Array.prototype.slice.call(arguments, 0),
    sql = args.shift(),
    fn = args.pop();

  if(!binding){
    return fn(new Error('store `websql` not supported by this browser'));
  }
  db.transaction(function(t){
    t.executeSql(sql, args, fn, null);
  });
}

module.exports = {
  binding: binding,
  get: function(key, fn){
    run('SELECT * FROM stor WHERE key = ?', key, function(_, res){
      var rows = res.rows;
      fn(null, rows.length ? JSON.parse(rows.item(0).value) : null);
    });
  },
  set: function(key, value, fn){
   run('INSERT OR REPLACE INTO stor (key, value) VALUES (?, ?)',
    key, JSON.stringify(value), function(){fn();});
  },
  remove: function(key, fn){
    run('DELETE FROM stor WHERE key = ?', key, function(){fn();});
  },
  clear: function(fn){
    run('DELETE FROM store', function(){fn();});
  },
  length: function(fn){
    run('SELECT COUNT(key) as count FROM stor', function(_, res){
      fn(null, res.rows.item(0).count);
    });
  },
  key: function(n, fn){
    run('SELECT key FROM stor WHERE id = ? LIMIT 1', n + 1, function(_, res){
      fn(null, res.rows.length ? res.rows.item(0).key : null);
    });
  }
};
