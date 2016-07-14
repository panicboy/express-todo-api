var express  = require('express');
var Router = express.Router();
var bodyParser = require('body-parser');
var buzzWordList = [];
var buzzWordLookups = [];
var score = 0;


Router.post('/', (req, res) => {
  var body = coerceBody(req.body);
  if(req.originalUrl == '/reset') {
    if(validateParams(body, {reset: 'boolean'}, {reset: true})) resetBuzzWords(body, res);
  } else {
      if(body.buzzWord){
        if(validateParams(body, {buzzWord: 'string', points: 'number'})){
          body.heard = false;
          storeBuzzWord(body, res);
        } else {
          sendStatus(res, 400, false);
        }
      }
    if(body.reset) sendStatus(res, 400, false);
  }
});

Router.put('/', (req, res) => {
  var body = coerceBody(req.body);
  if(validateParams(body, {buzzWord: 'string', heard: 'boolean'})) updateBuzzWord(body, res);
});

Router.delete('/', (req, res) => {
  var body = coerceBody(req.body);
  if(validateParams(body, {buzzWord: 'string'})) deleteBuzzWord(body, res);
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

function validateParams(body, paramObject, paramVals){
  var checkParamVals = (arguments.length == 3);
  var testParams = Object.getOwnPropertyNames(paramObject);
  for (var i = 0; i <= testParams.length -1; i++) {
    let param = testParams[i];
    if(!body.hasOwnProperty(param)) return false;
    // console.log(param,': ', body[param], ', type: ', typeof body[param], ', expected type: ', paramObject[param]);
    if(typeof body[param] != paramObject[param]) return false;
    if((checkParamVals && paramVals.hasOwnProperty(param)) &&  body[param] != paramVals[param]) return false;
  }
  return true;
}

function coerceBody(theData){
  Object.keys(theData).forEach(function(key) {
    let keyVal = theData[key];
    if(key == 'reset' || key == 'heard') theData[key] = coerceBoolean(theData[key]);
    if(key == 'points') theData[key] = coerceNumber(theData[key]);
  });
return theData;
}

function coerceBoolean(theVal) {
  if(['true',true,'false', false].indexOf(theVal) >= 0) return (theVal == 'true' || theVal === true);
  return null;
}

function coerceNumber(theVal) {
  if(Number(theVal)==theVal) return Number(theVal);
  return null;
}