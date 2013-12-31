var router = require('./NodeRails/router')

var testFn = function(){}
var secondFn = function(){}

router.registerRoutes(
  router.get('/', 'login#index')
);


require('./NodeRails/server').start()
