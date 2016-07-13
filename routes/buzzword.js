var express  = require('express');
var Router = express.Router();
var qstring = require('querystring');
var buzzWordList = [];
var buzzWordLookups = [];


Router.post('/', (req, res) => {
  console.log('req.method: ', req.method, ', url: ', req.url);
  bufferAndParseRequest(req, (buzzObject) => {
    console.log('parsed data: ', buzzObject);
    buzzObject.heard = false;
    storeBuzzWord(buzzObject, res); // also sends response
  });
});

Router.put('/', (req, res) => {
  console.log('req.method: ', req.method, ', url: ', req.url);
  bufferAndParseRequest(req, (buzzObject) => {
    console.log('parsed data: ', buzzObject);
    buzzObject.heard = true;
    updateBuzzWord(buzzObject, res); // also sends response
  });
});

Router.delete('/', (req, res) => {
  console.log('req.method: ', req.method);
  bufferAndParseRequest(req, (buzzObject) => {
    console.log('parsed data: ', buzzObject);
    deleteBuzzWord(buzzObject, res); // also sends response
  });
});

Router.get('/', (req, res) => {
  if(req.originalUrl == '/buzzwords'){
    res.status(400).json({"buzzWords": buzzWordList});
  }
});

module.exports = Router;

function bufferAndParseRequest(request, theCallback){
  var theBuffer = '';
  request.on('data', (chunk) => {
    theBuffer += chunk;
  });
  request.on('end', () => {
     theCallback(qstring.parse(theBuffer.toString()));
  });
}

function storeBuzzWord(theBuzzObject, res){
  var lcBuzzWord = theBuzzObject.buzzWord.toLowerCase();
  if(buzzWordLookups.indexOf(lcBuzzWord) < 0) {
    buzzWordLookups.push(lcBuzzWord);
    buzzWordList.push(theBuzzObject);
    res.status(201).json({"success": true});
    console.log('buzzWordList: ', buzzWordList.slice(-1));
    console.log('buzzword count: ', buzzWordLookups.length);
    return true;
  }
  res.status(400).json({"success": false});
  return false;
}

function updateBuzzWord(theBuzzObject, res){
  var lcBuzzWord = theBuzzObject.buzzWord.toLowerCase();
  var buzzIndex = buzzWordLookups.indexOf(lcBuzzWord);
  if(buzzIndex >= 0) {
    buzzWordLookups.splice(buzzIndex,1,lcBuzzWord);
    console.log('old entry: ', buzzWordList.splice(buzzIndex,1,theBuzzObject));
    res.status(200).json({"success": true});
    console.log('replacement: ', buzzWordList[buzzIndex]);
    return true;
  }
  res.status(400).json({"success": false});
  return false;
}

function deleteBuzzWord(theBuzzObject, res){
  var lcBuzzWord = theBuzzObject.buzzWord.toLowerCase();
  var buzzIndex = buzzWordLookups.indexOf(lcBuzzWord);
  if(buzzIndex >= 0) {
    buzzWordLookups.splice(buzzIndex,1);
    console.log('removed: ', buzzWordList.splice(buzzIndex,1));
    console.log('buzzword count: ', buzzWordLookups.length);
    res.status(200).json({"success": true});
    return true;
  }
  console.log(`'${theBuzzObject.buzzWord}' not found.`);
  res.status(400).json({"success": false});
  return false;
}