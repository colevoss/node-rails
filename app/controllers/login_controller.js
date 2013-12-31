var render = require('../../NodeRails/render')

module.exports = LoginController = {

  layout: 'login',

  index: function(req, res) {
    render({name: 'Blaine'}, req, res)
  }

}
