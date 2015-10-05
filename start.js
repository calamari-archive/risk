var express = require('express'),
		app = express.createServer();

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, res) {
	res.render('testfrontend.ejs', { layout: false });
});

app.listen(8124);
console.log("Started 127.0.0.1:8124");
