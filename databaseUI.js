var express = require('express');
// var mysql = require('./dbcon.js');
var mysql = require('./dbcon.js');

var pool = mysql.pool;

// module.exports.pool = pool;

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
// var session = require('express-session');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);


app.get('/',function(req,res,next){
	var context = {};

	pool.query('SELECT * FROM workouts', function(err, rows, fields){

	if(err){
		next(err);
		return;
	}

	res.header("Access-Control-Allow-Origin", "*");
	res.type("JSON");
	res.send(rows);

	});

});


app.get('/update', function(req, res, next){

	var context = {};
	pool.query('SELECT * FROM workouts WHERE id=?', [req.query.id], function(err, result){

		if (err){
			next(err);
			return;
		}

		if (result.length == 1){

			var curVals = result[0];
			pool.query('UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?', [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id], function(err, result){

				if (err){
					next(err);
					return;
				}

				res.header("Access-Control-Allow-Origin", "*");
				res.status(200);

				context.results = 'Updated ' + result.changedRows + ' rows.';
				res.render('home', context);
			});
		}

	});
});

app.get('/insert',function(req,res,next){
	var context = {};

	pool.query("INSERT INTO workouts(name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){

	if(err){
	  next(err);
	  return;
	}

	res.header("Access-Control-Allow-Origin", "*");
	res.status(200);

	context.results = "Inserted id " + result.insertId;
	res.render('home',context);

	});
});


app.get('/delete', function(req, res, next){

	var context = {};

	pool.query("DELETE FROM workouts WHERE id = ?", [req.query.id], function(err, result){

		if (err){
			next(err);
			return;
		}

		context.results = 'Deleted' + result.id;
		res.header("Access-Control-Allow-Origin", "*");
		res.render('home', context);

	});

});


app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
	var createString = "CREATE TABLE workouts("+
	"id INT PRIMARY KEY AUTO_INCREMENT,"+
	"name VARCHAR(255) NOT NULL,"+
	"reps INT,"+
	"weight INT,"+
	"date DATE,"+
	"lbs BOOLEAN)";
	pool.query(createString, function(err){
		context.results = "Table reset";
		res.header("Access-Control-Allow-Origin", "*");
		res.render('home',context);
	})
  });
});



app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
