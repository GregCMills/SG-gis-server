const express = require('express')
const app = express()
const path = require("path")
const serveIndex = require('serve-index')
const fs = require('fs');

const shapeFilesDir = './public/shapefiles';
const port = 4000
const serverUrl = `http://192.168.0.183:${4000}`

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/geoJSON', express.static(path.join(__dirname, 'public/geoJSON')), serveIndex(path.join(__dirname, 'public/geoJSON'), {'icons': true}));

app.get('/', (request, response) => {
  response.sendFile(__dirname+'/index.html')
})

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
			let name = files[i];
        var fileLocation = dir + '/' + name;
        if (fs.statSync(fileLocation).isDirectory()){
            getFiles(fileLocation, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

app.get('/geoJSONlist', (request, response) => {
	let fileNames = getFiles('./public/geoJSON');
	let jsonShapeFiles = {'urls': []}
	
	for (fileName of fileNames) {
		let editedFileName = fileName;
		jsonShapeFiles['urls'].push({'url': `${serverUrl}/geoJSON/${fileName}`});
	}
	
	response.json(jsonShapeFiles);
	
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})

