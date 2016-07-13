var express  = require('express');
var Router = express.Router();
var bodyParser = require('body-parser');
var buzzWordList = [];
var buzzWordLookups = [];
var score = 0;


Router.post('/', (req, res) => {
  if(req.originalUrl == '/reset') {
    resetBuzzWords(req.body, res);
  } else {
      if(req.body.buzzWord){
        req.body.points = Number(req.body.points);
        req.body.heard = false;
        storeBuzzWord(req.body, res);
      }
    if(req.body.reset) sendStatus(res, 400, false);
  }
});

Router.put('/', (req, res) => {
    updateBuzzWord(req.body, res);
});

Router.delete('/', (req, res) => {
    deleteBuzzWord(req.body, res);
});

Router.get('/', (req, res) => {
  if(req.originalUrl == '/buzzwords') res.status(200).json({"buzzWords": buzzWordList});
});

module.exports = Router;


function storeBuzzWord(body, res){
  var b = buzzFind(body);
  if(!b.found) {
    buzzWordLookups.push(b.lcWord);
    buzzWordList.push(body);
    return sendStatus(res, 201, true);
  } else {
    sendStatus(res, 400, false);
  }
}

function updateBuzzWord(body, res){
  var b = buzzFind(body);
  if(b.found) {
    var bHeard = (body.heard === true || body.heard == 'true');
    if(bHeard) score += Number(buzzWordList[b.indx].points);
    if(!bHeard) score -= Number(buzzWordList[b.indx].points);
    buzzWordList[b.indx].heard = bHeard;
    sendStatus(res, 200, true, score);
  } else {
    sendStatus(res, 400, false);
  }
}

function deleteBuzzWord(body, res){
  var b = buzzFind(body);
  if(b.found) {
    buzzWordLookups.splice(b.indx,1);
    buzzWordList.splice(b.indx,1);
    sendStatus(res, 200, true);
  } else {
    console.log(`'${buzzReq.buzzWord}' not found.`);
    sendStatus(res, 400, false);
  }
}

function resetBuzzWords(body,res){
  if(validateReset(body)){
    console.log('reset request validated');
    buzzWordList = [];
    buzzWordLookups = [];
    score = 0;
    sendStatus(res, 200, true);
  } else {
    console.log('reset request not validated');
    sendStatus(res, 400, false);
  }
}

function validateReset(body){
  if(body.reset == 'undefined') return false;
  if(body.reset != 'true' && body.reset !== true) return false;
  return true;
}

function buzzFind(body){
  var lcBuzzWord = body.buzzWord.toLowerCase();
  var buzzIndex = buzzWordLookups.indexOf(lcBuzzWord);
  if(buzzIndex < 0) return {found: false, lcWord: lcBuzzWord};
  return {found: true, indx: buzzIndex};
}

function sendStatus(res, statusCode, resultBoolean, score) {
  if(arguments.length == 3) res.status(statusCode).json({"success": resultBoolean});
  if(arguments.length == 4) res.status(statusCode).json({"success": resultBoolean, newScore: score});
  return resultBoolean;
}