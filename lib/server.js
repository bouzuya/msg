var express = require('express');

var app = express();
app.configure(function() {
  app.set('port', 3000);
  app.get('/', function(req, res) {
    res.send('Hello');
  });
});

module.exports = app;

