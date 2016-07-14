
'use strict';
const app = require('./server');
const portNum = process.env.PORT || '3000';

// app.listen(portNum);

var server = app.listen(portNum, function(){
  var host = server.address().address;
  var port = portNum;

  console.log(`Example app listening at http://localhost:${port}`);
});