const fs = require('fs');
const http = require('http');
const formidable = require('formidable');


const server = http.createServer(function (request, response) {
    console.log("HI THERE! LET ME IN");

    if (request.url === '/upload' && request.method === 'POST') {
        console.log("Arrived at http://localhost:5000/")

        const form = new formidable.IncomingForm();

        form.parse(request, function (error, fields, files) {

            const uploadedFile = files.characterCard[0];
            console.log("we successfully unpacked: " + uploadedFile.originalFilename);

            response.writeHead(200);
            response.end("Success");
        });

    }
    else {

        fs.readFile('index.htm', function (error, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        });
    }
});

server.listen(5000, function() {
    console.log("hey, im here, living inside your computer");
});
