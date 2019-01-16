const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const legs = require('./data/stops.json')
const stops = require('./data/stops.json')

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});
