var Base = require('../../NodeRails/base_model')
var util = require('util')

function Users(){
  this.belongsTo('state')
  //console.log(this.belongs_to)
}



//Users.prototype = Base
util.inherits(Users, Base)
//Users.prototype.constructor = Users

module.exports = new Users()
