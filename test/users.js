var should = require('should');
var mongodb = require('mongodb');
var supertest = require('supertest');
var async = require('async');
var server = require('../lib/server');

describe('users', function() {

  describe('GET /users', function() {

    beforeEach(function(done) {
      mongodb.MongoClient.connect('mongodb://localhost:27017/msg', function(err, db) {
        if (err) return done(err);
        var users = db.collection('users');
        users.remove(function(err, result) {
          if (err) return done(err);
          db.close();
          done();
        });
        });
    });

    it('should return users', function(done) {
      var username1 = 'bouzuya-1';
      var username2 = 'bouzuya-2';
      var tasks = [];
      tasks.push(function(next) {
        supertest(server)
        .post('/users')
        .send({ id: username1, name: username1 })
        .expect(200)
        .end(function(err, res) {
          if (err) return next(err);
          return next();
        });
      });
      tasks.push(function(next) {
        supertest(server)
        .post('/users')
        .send({ id: username2, name: username2 })
        .expect(200)
        .end(function(err, res) {
          if (err) return next(err);
          return next();
        });
      });
      tasks.push(function(next) {
        supertest(server)
        .get('/users')
        .expect(200)
        .end(function(err, res) {
          if (err) return next(err);
          var json = JSON.parse(res.text);
          json.forEach(function(item) {
            item.should.have.a.property('id');
            item.should.have.a.property('name');
          });
          next();
        });
      });
      async.waterfall(tasks, function(err, result) {
        done(err);
      });
    });

  });

  describe('GET /users/:id', function() {

    beforeEach(function(done) {
      mongodb.MongoClient.connect('mongodb://localhost:27017/msg', function(err, db) {
        if (err) return done(err);
        var users = db.collection('users');
        users.remove(function(err, result) {
          if (err) return done(err);
          db.close();
          done();
        });
        });
    });

    it('should return an user', function(done) {
      var username1 = 'bouzuya-1';
      var username2 = 'bouzuya-2';
      var tasks = [];
      tasks.push(function(next) {
        supertest(server)
        .post('/users')
        .send({ id: username1, name: username1 })
        .expect(200)
        .end(function(err, res) {
          if (err) return next(err);
          return next();
        });
      });
      tasks.push(function(next) {
        supertest(server)
        .post('/users')
        .send({ id: username2, name: username2 })
        .expect(200)
        .end(function(err, res) {
          if (err) return next(err);
          return next();
        });
      });
      tasks.push(function(next) {
        supertest(server)
        .get('/users/' + username2)
        .expect(200)
        .end(function(err, res) {
          if (err) return next(err);
          var json = JSON.parse(res.text);
          json.should.have.a.property('id', username2);
          json.should.have.a.property('name', username2);
          next();
        });
      });
      async.waterfall(tasks, function(err, result) {
        done(err);
      });
    });

  });

  describe('POST /users', function() {

    beforeEach(function(done) {
      mongodb.MongoClient.connect('mongodb://localhost:27017/msg', function(err, db) {
        if (err) return done(err);
        var users = db.collection('users');
        users.remove(function(err, result) {
          if (err) return done(err);
          db.close();
          done();
        });
        });
    });

    it('should return 200', function(done) {
      var username = 'bouzuya';
      supertest(server)
      .post('/users')
      .send({ id: username, name: username })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        var json = JSON.parse(res.text);
        json.should.have.property('id', username);
        json.should.have.property('name', username);
        done(err);
      });
    });

  });

  describe('DELETE /users/:id', function() {
    var username = 'bouzuya';

    beforeEach(function(done) {
      mongodb.MongoClient.connect('mongodb://localhost/msg', function(err, db) {
        if (err) return done(err);
        var users = db.collection('users');
        users.remove(function(err, result) {
          if (err) return done(err);
          db.close();

          supertest(server)
          .post('/users')
          .send({ id: username, name: username })
          .end(done);
        });
        });
    });

    it('should return 200', function(done) {
      var username = 'bouzuya';
      supertest(server)
      .del('/users/' + username)
      .expect(200, done);
    });

  });

});

