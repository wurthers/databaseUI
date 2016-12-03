var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'mysql.eecs.oregonstate.edu',
  user            : 'cs290_wortheyt',
  password        : '9128',
  database        : 'cs290_wortheyt'
});

module.exports.pool = pool;
