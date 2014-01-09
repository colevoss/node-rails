var fs = require('fs')

function modelRequire(){
  path = __dirname + "/../backend/models/"
  files = fs.readdirSync(path)
  for (_i in files){
    file = files[_i].replace(/\.js$/, '')
    require_path = path + file
    export_name = file.charAt(0).toUpperCase() + file.slice(1)
    exports[export_name] = require(require_path)
  }
  return exports
}

module.exports = modelRequire()
