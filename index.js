var server = require('./lib/server');

if (!module.parent) {
  server.listen(server.get('port'));
}

