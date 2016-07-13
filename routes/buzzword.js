var express  = require('express');
var Router = express.Router();
var qstring = require('querystring');
var buzzwordList = [];
var buzzWordLookups = [];

// Router.get('/counter', (req, res) => {
//   res.send(`counter is currently ${counter}`);
// });

// Router.get('/', (req, res) => {
//   res.send(`counter is currently ${counter}`);
// });

Router.post('/', (req, res) => {
  console.log('req.method: ', req.method);
  bufferAndParseRequest(req, (buzzObject) => {
    console.log('parsed data: ', buzzObject);
    buzzObject.heard = false;
    // res.send(JSON.stringify(`{'success':${storeBuzzWord(buzzObject)}}`));
    storeBuzzWord(buzzObject, res); // also sends response
  });
  // Creates a new buzzword object. Returns true if successful else false
  // body: { "buzzWord": String, "points": Number }
  // response: { "success": true }

  });

Router.put('/', (req, res) => {
  console.log('req: ', req);
  // Updates a buzzword. Returns true and the new score if successful otherwise returns just false
  // body: { "buzzWord": String, "heard": Bool }
  // response: { "success": true, newScore: Number }

});

Router.delete('/', (req, res) => {
  console.log('req: ', req);
  // Delete a buzzword. Returns true if successful else false
  // body: { "buzzWord": String }
  // response: { "success": true }

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
    buzzwordList.push(theBuzzObject);
    res.status(201).json({"success": true});
    console.log('buzzwordList: ', buzzwordList.slice(-1));
    console.log('buzzWordLookups: ', buzzWordLookups.slice(-1));
    return true;
  }
  res.status(400).json({"success": false});
  return false;
}