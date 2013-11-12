var async = require('async');
var should = require('should');
var supertest = require('supertest');
var mongodb = require('mongodb');
var server = require('../lib/server');

describe('message', function() {
  var user1_id = 'user1';
  var user2_id = 'user2';

  beforeEach(function(done) {
    mongodb.MongoClient.connect('mongodb://localhost:27017/msg', function(err, db) {
      if (err) return done(err);
      var users = db.collection('users');
      users.remove(function(err, result) {
        if (err) return done(err);
        var messages = db.collection('messages');
        messages.remove(function(err, result) {
          if (err) return done(err);
          db.close();
          supertest(server)
          .post('/users')
          .send({ id: user1_id, name: user1_id })
          .end(function(err, res) {
            if (err) return done(err);
            supertest(server)
            .post('/users')
            .send({ id: user2_id, name: user2_id })
            .end(done);
          });
        });
      });
  });
  });

  describe('GET /users/:user_id/messages', function() {
    it('', function(done) {
      var tasks = [];
      tasks.push(function(next) {
        supertest(server)
        .post('/users/' + user1_id + '/messages')
        .send({ to: user2_id, message: 'hello' })
        .end(function(err, res) {
          next(err);
        });
      });
      tasks.push(function(next) {
        supertest(server)
        .get('/users/' + user1_id + '/messages')
        .expect(200)
        .end(function(err, res) {
          if (err) return next(err);
          var json = JSON.parse(res.text);
          json.should.be.a.instanceof(Array).and.lengthOf(1);
          next();
        });
      });
      async.waterfall(tasks, function(err, result) {
        done(err);
      });
    });
  });

  describe('GET /users/:user_id/messages/:id', function() {
    it('', function(done) {
      var message_id;
      var tasks = [];
      tasks.push(function(next) {
        supertest(server)
        .post('/users/' + user1_id + '/messages')
        .send({ to: user2_id, message: 'Hello' })
        .end(function(err, res) {
          if (err) return next(err);
          var json = JSON.parse(res.text);
          message_id = json._id;
          next(err);
        });
      });
      tasks.push(function(next) {
        supertest(server)
        .get('/users/' + user1_id + '/messages/' + message_id)
        .expect(200)
        .end(function(err, res) {
          if (err) return next(err);
          var json = JSON.parse(res.text);
          json.should.eql({
            _id: message_id,
            user_id: user1_id,
            to: user2_id,
            message: 'Hello'
          });
          next();
        });
      });
      async.waterfall(tasks, function(err, result) {
        if (err) return done(err);
        done();
      });
    });
  });

  describe('POST /users/:user_id/messages', function() {
    it('', function(done) {
      supertest(server)
      .post('/users/' + user1_id + '/messages')
      .send({ to: user2_id, message: 'hello' })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        var json = JSON.parse(res.text);
        json.should.have.a.property('user_id', user1_id);
        json.should.have.a.property('to', user2_id);
        json.should.have.a.property('message', 'hello');
        done();
      });
    });
  });

});
