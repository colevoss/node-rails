var url = require("url");
var fs = require('fs');
var router = require('./router');
var blade = require('blade');
/*
 * @module render
 * @type {Function}
 *
 * A function to be used to render the name of the file.
 * It will look down the controller and action name translated
 * to file paths. For example. Given Controller `UserController`
 * and action `index()` render will render a .blade file at
 *
 * ./app/views/user/index.blade
 */

var render = (function(){

  var decypherRoute, renderLayout, viewDir, findFilePath,
      renderPage, request, response, error, layoutDir;

  /*
   * The directory to the views and layouts
   */

  viewDir = './app/views/'
  layoutDir = './app/views/layouts/'

  /*
   * Function used to get the correlated string to the route
   * This helps us get information from the Controller used
   *
   * @private
   * @returns {String} in style of 'controller#action'
   */

  decypherRoute = function(){

    var pathname, type;

    pathname = url.parse(request.url).pathname;
    type = request.method

    return router.routes[type + " " + pathname]

  }

  /*
   * finds the file path for the controller and action.
   *
   * @private
   * @type {Function}
   *
   * @returns {String} filepath
   */

  findFilePath = function() {

    var filePath = decypherRoute().replace(/#/, '/');

    return viewDir + filePath + '.blade';

  }

  /*
   * this function will run `blade.compileFile` for the layout specified
   * by the controller.
   *
   * @type {Function}
   * @private
   *
   * @params {Object} ie. {render: "<html>"}
   * @params {Function}
   */

  renderLayout = function(pageRenderObj, cb) {
    var controller, controllerSurName, filePath;

    controllerSurName = decypherRoute().split(/#/)[0]
    controller = require('../app/controllers/' + controllerSurName + '_controller.js');

    // Hit the callback without an argument 
    if (!controller.layout)
      cb()

    filePath = layoutDir + controller.layout + '.blade';

    blade.compileFile(filePath, function(err, tmplFn){

      if (!err){
        tmplFn(pageRenderObj, function(err, html){

          if (!err){
            cb(html);

          } else {
            console.log(("\nLoading " + controller.layout + " layout failed.").red);
            console.log(err);
            error()
          }

        });

      } else {

        console.log(("\nLoading " + controller.layout + " layout failed.").red);
        console.log(err);
        error()
      }
    });
  }

  /*
   * this function will run the `blade.compileFile` for the related file
   *
   * @type {Function}
   * @private
   *
   * @params {Object} Passed into the object
   * @params {Function} Callback
   */

  renderPage = function(tmplObj, cb) {
    var filePath;

    filePath = findFilePath()

    blade.compileFile(filePath, function(err, tmplFn){

      if (!err){
        tmplFn(tmplObj, function(err, html){

          if (!err){
            console.log(("Served file at: " + filePath).yellow);

            // Call the callback on success
            cb(html);

          } else {
            console.log(("\nAn error inserting javascript into the template at " + filePath).red);
            console.log(err);
            error()
          }
        });

      } else {
        console.log(("\nAn error occurred compiling at " + filePath).red);
        console.log(err);
        error()
      }

    });
  }


  /*
   * Error function to return a 500 server response
   *
   * @type {Function}
   * @private
   */

  error = function() {
    response.statusCode = 500
    response.end()
  }

  /*
   * The function returned to the render variable
   *
   * @public
   * @type {Function}
   *
   * @params {Object} - Object to pass into the template
   * @params {RequestObject}
   * @params {ResponseObject}
   */

  return function(tmplObj, req, res){
    var pageRender;

    request = req
    response = res

    renderPage(tmplObj, function(pageRender){

      if (pageRender){

        renderLayout({outlet: pageRender}, function(layoutRender) {

          // Push the html to the browser
          if (layoutRender) {
            res.write(layoutRender)
            res.end()
          } else {
            res.write(pageRender)
            res.end()
          }
        });

      } else
        error()

    });
  }
})();

module.exports = render
