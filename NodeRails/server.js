var http = require("http");
var router = require('./router');

require('colors');
var resp;

function start() {

  function onRequest(req, res) {
    resp = res
    router.route(req, res);
  }

  process.on('uncaughtException', function(error){
    console.log(error.stack);
    resp.end()
  });

  http.createServer(onRequest).listen(8888);

  console.log("Server has started.".yellow);
}

exports.start = start
