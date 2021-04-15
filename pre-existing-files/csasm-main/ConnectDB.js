
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12395856",
  password: "mPewIJqsib"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("SELECT * FROM MTABLE", function (err, result, fields) {
    if (err) throw err;
    console.log("Result: " + result);
  });
});
