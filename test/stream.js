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

describe('Twitter streaming with sample data', function() {
  it('GET statuses/sample as a native stream and pipe to a file', function(done) {
    twitter.stream('statuses/sample', function(stream) {
      var output = fs.createWriteStream('./test/out.json');
      
      stream.pipe(output);

      stream.on('end', function() {
        var received = fs.statSync('./test/out.json').size;
        received.should.be.above(1);
        done();
      });

      setTimeout(function() {
        stream.destroy();
      }, 5000);
    });
  });
});
