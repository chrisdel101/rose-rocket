const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const legs = require('./data/legs.json')
const stops = require('./data/stops.json')
var driver = require('./data/driver.json')
const fs = require('fs')
app.use(express.json())


app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
console.log(driver)
// create a GET route
app.get('/stops', (req, res) => {
	res.send({
		stops: stops
	})
});
app.get('/legs', (req, res) => {
	res.send({
		legs: legs
	});
});
app.get('/driver', (req, res) => {
	res.send({
		driver: driver
	});
});
// https://stackoverflow.com/a/49943829/5972531
// just add to memory
app.put('/driver', (req, res) => {
    res.json({requestBody: req.body})  // <==== req.body will be a parsed JSON object
    driver["activeLegID"] = req.body.activeLegID
    driver["legProgress"] = req.body.legProgress
    console.log(driver)

});
