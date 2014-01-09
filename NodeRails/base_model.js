var db = require('./database')
var inflection = require('inflection')

function Model(){
}

Model.prototype.store = []
Model.prototype.belongs_to = []
Model.prototype.has_one = []
Model.prototype.has_many = []

Model.prototype.resolveBelongsToRelationships = function(){
  // Array of belongs_to relationships
  relationships = this.belongs_to

  // Loop through belongs_to to add them as
  // instance methods
  for (var _i in relationships){
    relationship = relationships[_i]
    this[relationships[_i]] = function(cb){
      table = inflection.pluralize(relationship)
      rel_id = relationship + "_id"
      query = "SELECT * FROM " + table + " WHERE id=" + this[rel_id] + "";
      db.query(query, function(results){
        cb(results[0])
      })
    }
  }
}

Model.prototype.belongsTo = function(relative){
  if (this.belongs_to.indexOf(relative) == -1){
    this.belongs_to.push(relative)
  }
  this.resolveBelongsToRelationships()
}

Model.prototype.hasOne = function(relative){
  if (this.has_one.indexOf(relative) == -1){
    this.has_one.push(relative)
  }
  this.resolveRelationships()
}

Model.prototype.hasMany = function(relative){
  if (this.has_many.indexOf(relative) == -1){
    this.has_many.push(relative)
  }
  this.resolveRelationships()
}

Model.prototype.find = function(id, cb) {
  table = this.constructor.name.toLowerCase()
  query = "SELECT * FROM " + table + " WHERE id=" + id + "";
  _th = this
  db.query(query, function(results){
    record = new _th.constructor().setParams(results[0])
    return cb(record)
  })
}

Model.prototype.findAll = function(cb) {
  table = this.constructor.name.toLowerCase()
  query = "SELECT * FROM " + table + ""
  _th = this
  db.query(query, function(results){
    var records = []
    for (var _i in results){
      record = new _th.constructor().setParams(results[_i])
      records.push(new _th.constructor().setParams(results[_i]))
    }
    cb(records)
  })
}

Model.prototype.setParams = function(params){
  for(key in params){
    this[key] = params[key]
  }
  return this
}


module.exports = Model
