var ObjectID = require('mongodb').ObjectID;

exports.list = function(req, res) {
  var messages_list = function(db, user_id, callback) {
    var messages = db.collection('messages');
    messages.find({ user_id: user_id }).toArray(callback);
  };

  var user_id = req.param('user_id');
  messages_list(req.app.db, user_id, function(err, result) {
    if (err) {
      res.send(500);
    } else {
      res.send(result);
    }
  });
};

exports.show = function(req, res) {
  var messages_show = function(db, params, callback) {
    var messages = db.collection('messages');
    messages.findOne({ _id: ObjectID.createFromHexString(params.message_id) }, callback);
  };

  var params = {
    user_id: req.param('user_id'),
    message_id: req.param('id')
  };
  messages_show(req.app.db, params, function(err, result) {
    if (err) {
      res.send(500);
    } else {
      res.send(result);
    }
  });
};

exports.create = function(req, res) {
  var messages_create = function(db, params, callback) {
    var messages = db.collection('messages');
    messages.insert(params, function(err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result[0]);
      }
    });
  };

  messages_create(req.app.db, {
    user_id: req.param('user_id'),
    to: req.param('to'),
    message: req.param('message')
  }, function(err, result) {
    if (err) {
      res.send(500);
    } else {
      res.send(result);
    }
  });
};

