var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var scraper = require('./lib/hilink-scraper')

/* Init database and models */
mongoose.connect('mongodb://localhost/rede');
require('./app/models/reading');

/* Start scraping when mongoose is ready */
mongoose.connection.on('open', function(){
	scraper.init();
});

app.use('/', express.static(__dirname + '/public'));
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

/* Controllers */
var readings = require(__dirname + '/app/controllers/readings');
app.get('/', readings.list );

// Start the app by listening on <port>
var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port ' + port)
