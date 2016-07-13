var express  = require('express');
var Router = express.Router();
var qstring = require('querystring');
var buzzWordList = [];
var buzzWordLookups = [];
var score = 0;


Router.post('/', (req, res) => {
  if(req.originalUrl == '/reset') {
    resetBuzzWords(req, res);
  } else {
    bufferAndParseRequest(req, (buzzReq) => {
      if(buzzReq.buzzWord){
        buzzReq.points = Number(buzzReq.points);
        buzzReq.heard = false;
        storeBuzzWord(buzzReq, res);
      }
      if(buzzReq.reset) sendStatus(res, 400, false);
    });
  }
});

Router.put('/', (req, res) => {
  bufferAndParseRequest(req, (buzzReq) => {
    updateBuzzWord(buzzReq, res);
  });
});

Router.delete('/', (req, res) => {
  bufferAndParseRequest(req, (buzzReq) => {
    deleteBuzzWord(buzzReq, res);
  });
});

Router.get('/', (req, res) => {
  if(req.originalUrl == '/buzzwords'){
    res.status(400).json({"buzzWords": buzzWordList});
  }
});

module.exports = Router;

function bufferAndParseRequest(req, theCallback){
  var theBuffer = '';
  req.on('data', (chunk) => {
    theBuffer += chunk;
  });
  req.on('end', () => {
     theCallback(qstring.parse(theBuffer.toString()));
  });
}

function storeBuzzWord(buzzReq, res){
  var b = buzzFind(buzzReq);
  if(!b.found) {
    buzzWordLookups.push(b.lcWord);
    buzzWordList.push(buzzReq);
    return sendStatus(res, 201, true);
  } else {
    sendStatus(res, 400, false);
  }
}

function updateBuzzWord(buzzReq, res){
  var b = buzzFind(buzzReq);
  if(b.found) {
    var buzzReqHeard = (buzzReq.heard === true || buzzReq.heard == 'true');
    if(buzzReqHeard) score += Number(buzzWordList[b.indx].points);
    if(!buzzReqHeard) score -= Number(buzzWordList[b.indx].points);
    buzzWordList[b.indx].heard = buzzReqHeard;
    sendStatus(res, 200, true, score);
  } else {
    sendStatus(res, 400, false);
  }
}

function deleteBuzzWord(buzzReq, res){
  var b = buzzFind(buzzReq);
  if(b.found) {
    buzzWordLookups.splice(b.indx,1);
    buzzWordList.splice(b.indx,1);
    sendStatus(res, 200, true);
  } else {
    console.log(`'${buzzReq.buzzWord}' not found.`);
    sendStatus(res, 400, false);
  }
}

function resetBuzzWords(req,res){
  bufferAndParseRequest(req, (buzzReq) => {
    if(validateReset(buzzReq)){
      console.log('reset request validated');
      buzzWordList = [];
      buzzWordLookups = [];
      sendStatus(res, 200, true);
    } else {
      console.log('reset request not validated');
      sendStatus(res, 400, false);
    }
  });
}

function validateReset(buzzReq){
  if(buzzReq.reset == 'undefined') return false;
  if(buzzReq.reset != 'true' && buzzReq.reset !== true) return false;
  return true;
}

function buzzFind(buzzReq){
  var lcBuzzWord = buzzReq.buzzWord.toLowerCase();
  var buzzIndex = buzzWordLookups.indexOf(lcBuzzWord);
  if(buzzIndex < 0) return {found: false, lcWord: lcBuzzWord};
  return {found: true, indx: buzzIndex};
}

function sendStatus(res, statusCode, resultBoolean, score) {
  if(arguments.length == 3) res.status(statusCode).json({"success": resultBoolean});
  if(arguments.length == 4) res.status(statusCode).json({"success": resultBoolean, newScore: score});
  return resultBoolean;
}