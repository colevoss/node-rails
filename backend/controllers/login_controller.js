var render = require('../../NodeRails/render')
var db = require('../../NodeRails/database')
var Model = require('../../NodeRails/model')

module.exports = LoginController = {

  layout: 'login',

  index: function(req, res) {
    //User.findAll(function(users){
      //render({users: users}, req, res)
    //})
    data = {}
    Model.User.find(178, function(user){
      data['user'] = user
      user.state(function(state){
        data['state'] = state
        render({user: data.user, state: data.state}, req, res)
      })
    })

  }

}
