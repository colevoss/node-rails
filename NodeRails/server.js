var http = require("http");
var router = require('./router');

require('colors');

function start() {

  function onRequest(req, res) {
    router.route(req, res);
  }
  http.createServer(onRequest).listen(8888);

  console.log("Server has started.".yellow);
}

exports.start = start
