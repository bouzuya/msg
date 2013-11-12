
exports.create = function(req, res) {
  var users_create = function(db, params, callback) {
    var users = db.collection('users');
    users.insert(params, function(err, result) {
      if (err) return callback(err);
      return callback(null, result[0]);
    });
  };
  var id = req.param('id');
  var name = req.param('name');
  var param = { id: id, name: name };
  users_create(req.app.db, param, function(err, result) {
    if (err) {
      res.send(500);
    } else {
      res.json(result);
    }
  });
};

exports.list = function(req, res) {
  var users_list = function(db, callback) {
    var users = db.collection('users');
    users.find().toArray(callback);
  };
  users_list(req.app.db, function(err, result) {
    if (err) {
      res.send(500);
    } else {
      res.json(result);
    }
  });
};

exports.show = function(req, res) {
  var users_list = function(db, id, callback) {
    var users = db.collection('users');
    users.findOne({ id: id }, callback);
  };
  var id = req.param('id');
  users_list(req.app.db, id, function(err, result) {
    if (err) {
      res.send(500);
    } else {
      res.json(result);
    }
  });
};


exports.delete = function(req, res) {
  var users_delete = function(db, id, callback) {
    var users = db.collection('users');
    users.remove({ id: id }, function(err, result) {
      if (err) return callback(err);
      db.close();
      callback();
    });
  };
  var id = req.param('id');
  users_delete(req.app.db, id, function(err) {
    if (err) {
      res.send(500);
    } else {
      res.send(200);
    }
  });
};

