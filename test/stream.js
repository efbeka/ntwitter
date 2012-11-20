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

describe('Twitter streaming with sample data', function() {
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

  it('GET statuses/sample as a native stream and pipe to a file', function(done) {
    twitter.stream('statuses/sample', function(stream) {
      var output = fs.createWriteStream('./out.json');
      stream
        .pipe(output)
        .on('end', function(tweet) {
          received = JSON.parse(fs.readFileSync('out.json'));
          received.length.should.be.above(1);
          done();
        });

      setTimeout(function() {
        stream.destroy();
      }, 50000);
    });
  });
});
