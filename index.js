require('newrelic')
const express = require('express');
const app = express();
const path = require('path')
const port = process.env.PORT || 4000;
const stops = require('./data/stops.json')


app.use(express.json())
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
// get stops json
app.get('/stops', (req, res) => {
	res.send({
		stops: stops
	})
});

app.listen(port, () => console.log(`Listening on port ${port}`));