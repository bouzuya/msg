var should = require('should');
var supertest = require('supertest');
var server = require('../lib/server');

describe('GET /', function() {
  it('should return 200 and "Hello"', function(done) {
    supertest(server)
    .get('/')
    .expect(200)
    .expect('Hello', done);
  });
});

