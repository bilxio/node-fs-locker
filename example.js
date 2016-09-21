var Locker = require('./');

var locker = Locker({
  path: '/tmp',
  name: 'test-locker.lock'
});

locker.acquire(function(err, release) {
  var handler = this;
  if (err) {
    return console.log('acquire lock failed.');
  }
  console.log('Bingo! Locked.');
  handler.release(function(err2) {
    if (err2) {
      return console.log('Ooops, release lock failed. ' + err2);
    }
    console.log('Lock released.');
  });
});
