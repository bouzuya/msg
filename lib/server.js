var express = require('express');
var mongodb = require('mongodb');
var users = require('./users');
var messages = require('./messages');

var db = function(f) {
  mongodb.MongoClient.connect('mongodb://localhost:27017/msg', function(err, db) {
    f(err, db);
  });
};

var app = express();
app.configure(function() {
  app.set('port', 3000);
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(function(req, res, next) {
    mongodb.MongoClient.connect('mongodb://localhost:27017/msg', function(err, db) {
      if (err) res.send(500);
      req.app.db = db;
      next();
    });
  });
  app.use(app.router);
  app.use(express.errorHandler());
});

app.post('/users', users.create);
app.get('/users', users.list);
app.get('/users/:id', users.show);
app.delete('/users/:id', users.delete);
app.post('/users/:user_id/messages', messages.create);
app.get('/users/:user_id/messages', messages.list);
app.get('/users/:user_id/messages/:id', messages.show);

module.exports = app;

