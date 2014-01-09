var mysql = require('mysql');
var colors = require("colors");

//var connection = mysql.createConnection({
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'notpassword',
  database: 'hopo_dev'
});

function call_query(query_string, cb) {
  pool.getConnection(function(err, connection){
    if (err) throw err;

    //connection.query('SELECT * FROM users WHERE given_name = "' + name + '" LIMIT 1', function(err, rows, fields){
    console.log(query_string.cyan)
    connection.query(query_string, function(err, rows, fields){

      if (err) throw err;
      connection.release()

      //console.log(rows)
      cb(rows)

    });
  });
}

exports.query = call_query
