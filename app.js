var path = require('path');
var express = require('express');
var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));
app.use('/', require('./routes/index'));

var port = process.env.PORT || 8000;

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});


module.exports = app;
