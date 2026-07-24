const fs = require('fs');
const http = require('http');
const formidable = require('formidable');
const { exec } = require('child_process');


const server = http.createServer(function (request, response) {
    console.log("HI THERE! LET ME IN");

    if (request.url === '/upload' && request.method === 'POST') {
        console.log("Arrived at http://localhost:5000/")

        const form = new formidable.IncomingForm();

        form.parse(request, function (error, fields, files) {
            const uploadedFile = files.characterCard[0];
            const oldLoc = uploadedFile.filepath;
            const newLoc = './' + uploadedFile.originalFilename;

            fs.copyFileSync(oldLoc, newLoc);
            console.log("success! saved file to: " + newLoc);

            const rawData = fs.readFileSync(newLoc, 'utf8');
            const finData = JSON.parse(rawData);
            console.log("the char name is: " + finData.data.name);

            const cleanText = (text) => {
                const fallback = "Left blank by the creator, so please be highly creative and invent fitting details based on the rest of the context";
                return (text || fallback)
                    .replace(/["\\]/g, "'")
                    .replace(/[\n\r\t]/g, " ")
                    .substring(0, 1000);
            };

            const charName = cleanText(finData.data.name);
            const charPers = cleanText(finData.data.personality);
            const charDesc = cleanText(finData.data.description);
            const charNotes = cleanText(finData.data.creator_notes);
            const charMes = cleanText(finData.data.first_mes);
            const charScen = cleanText(finData.data.scenario);

            const payloadContent = `${charName}\n${charPers}\n${charDesc}\n${charNotes}\n${charMes}\n${charScen}`;
            fs.writeFileSync('payload.txt', payloadContent, 'utf8');
            const commandToRun = `erosl-Gen.exe`;

            exec(commandToRun, (err, stdout, stderr) => {
                if (err) {
                    console.error(`ERR1! MATE! ${err.message}`);
                    return;
                } else if (stderr) {
                    console.error(`ERR2! LAD! ${stderr}`);
                    return;
                }
                console.log("C++ Output: " + stdout);
            });

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
