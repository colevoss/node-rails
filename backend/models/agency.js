var Base = require('../../NodeRails/base_model')

function Agencies(){}

Agencies.prototype = Object.create(Base.prototype)
Agencies.prototype.constructor = Agencies

module.exports = new Agencies()
