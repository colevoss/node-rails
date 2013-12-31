var url = require("url");
var colors = require("colors");

/*
 * Routing Module
 * Allows users to easily generate routes to call their callback functions
 *
 *
 * @type Module
 */

router = (function(){

  /*
   * This function is used to call the controller and action mapped.
   * For example, given the string 'user#index'. It will get the module
   * located in app/controllers/user_controller.js and call the action
   * `index` with the req and res objects.
   *
   * @type Function
   * @private
   *
   * @params {string} /path/name
   * @params {string} GET, PUT, etc
   * @params {Request Object}
   * @params {Response Object}
   */

  var callFunction = function(pathname, type, req, res){
    routeHandler = router.routes[type + " " + pathname];
    if (routeHandler) {

      controllerSurName = routeHandler.split(/#/)[0];
      controllerActionName = routeHandler.split(/#/)[1];
      controller = require(router.controllerDir + controllerSurName + '_controller.js');

      if (!controller[controllerActionName]){
        if (router.LOGGING)
          error(null, null, res, ("The " + controllerSurName + " controller does not have a function named " + controllerActionName.underline).red);

      } else {
        controller[controllerActionName](req, res);

        if (router.LOGGING)
          console.log(("\n" + type + " " + pathname + " successfully loaded.").green);
      }

    } else
      error(pathname, type, res)
  }

  /*
   * Function to return a 404 error to the browser.
   *
   * @private
   * @params {string}
   * @params {string}
   * @params {ResponseObject}
   * @params {string} optional.
   */

  var error = function(pathname, type, res, msg){
    if (router.LOGGING){
      if (msg){
        console.log(msg);
      } else {
        console.log(("\n" + type + " " + pathname + " did not route to any handlers.").red);
        console.log(("Implement (" + type + " " + pathname + ") with:").green);
        console.log(("router.registerRoutes( router." + type.toLowerCase() + "('" + type + "', callbackFn));\n").green);
      }
    }

    res.statusCode = 404
    res.end()
  }

  /*
   * Module
   */

  return {

    /*
     * Boolean to decide if errors are to be logged to the console.
     */

    LOGGING: true,

    /*
     * The directory to look for controllers inside of.
     * @type {string}
     */

    controllerDir: '../app/controllers/',

    /*
     * Internal hash of routes
     */

    routes: {},

    /*
     * Public function used to do the actual routing
     * masks the internal callFunction
     *
     * @type Function
     *
     * @params (string)
     * @params (string) request.method
     */

    route: function(req, res){
      var pathname = url.parse(req.url).pathname;
      var type = req.method

      if (pathname != '/favicon.ico'){
        callFunction(pathname, type, req, res);
      }
    },


    /*
     * Function used to register routes with the `Router`
     * It takes unlimited arguments but they should all be functions of the `Router`
     * For example:
     * ```javascript
     * `  router.registerRoutes(
     * `    router.get('/', getCallbackFn),
     * `    router.put('/', putCallbackFn)
     * `  )
     *
     * @params (functions)
     */

    registerRoutes: function(){
      var args = Array.prototype.splice.call(arguments, 0);
      for (var i = 0; i > args.length; i++){
        args[i].call();
      }
    },

    /*
     * `GET`, `PUT`, `POST`, `DELETE` methods to put the route in the internal hash
     *
     * @type Function
     *
     * @params {string} The path name to register for. i.e. '/users'
     * @params {string} The hash delimted controller and action names. i.e. 'user#index'
     */

    get: function(path, callback){ this.routes["GET "+path] = callback },
    put: function(path, callback){ this.routes["PUT "+path] = callback },
    post: function(path, callback){ this.routes["POST "+path] = callback },
    delete: function(path, callback){ this.routes["DELETE "+path] = callback },

  };

})();

module.exports = router
