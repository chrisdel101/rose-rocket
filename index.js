const https = require('http')
const fs = require('fs')
const path = require('path')
;

https.createServer(function(req, res) {

	console.log(`${req.method} request for ${req.url}`)

//if req is homepage-
	// serve index file with fs.readFile(path)
	if (req.url === "/") {
		//-----------HOME PAGE ---------------
		// after file is read, then the callback fires and response is sent
		// fs.readFile("./index.html", "UTF-8", function(err, html) {
        //
		// 	// this is reponse
		// 	res.writeHead(200, {
		// 		"Content-Type": "text/html"
		// 	})
		// 	res.end(html);
		// });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('Hello')
        res.end()

	} else if (req.url === "/twitter") {
		if (req.method === 'GET') {
			console.log('get req')


		} else if (req.method === 'POST') {
			console.log('post')


		}
	} else if (req.url === '/hello') {


			fs.writeFile('downloaded.jpg', body, 'binary', function(err) {});

	} else if (req.url === '/test') {
		console.log(res)
		res.writeHead(404, {
			"Content-Type": "text/plain"
		});


		res.end()
		// -------------404-----------------------
		// if not homepage, return headers that respond with 404
	} else {
		res.writeHead(404, {
			"Content-Type": "text/plain"
		});
		res.end("404 file not found")

	}


}).listen(5000); //server req


console.log("File Server is running on port 5000")



function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}
