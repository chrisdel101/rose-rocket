const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const legs = require('./data/legs.json')
const stops = require('./data/stops.json')
const driver = require('./data/driver.json')
app.use(express.json())

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
app.put('/driver', (req, res) => {
    res.json({requestBody: req.body})  // <==== req.body will be a parsed JSON object
    console.log(req.body)
    // driver = req.body
    // console.log(driver)

});
