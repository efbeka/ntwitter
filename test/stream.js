var ntwitter = require('../index.js'),
    mocha = require('mocha'),
    should = require('should'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('./config.json'));

var twitter = new ntwitter({
  consumer_key: config.key,
  consumer_secret: config.secret,
  access_token_key: config.token_key,
  access_token_secret: config.token_secret
});

var received = [];

describe('Streaming with twitter sample data', function() {
  it('GET statuses/sample', function(done) {
    twitter.stream('statuses/sample', function(stream) {
      stream.on('data', function (data) {
        received.push(data);
      });

      setTimeout(function() {
        stream.destroy();
      }, 50000);
      
      stream.on('destroy', function(msg) {
        received.length.should.be.above(1);
        done();
      });
    });
  });
});
