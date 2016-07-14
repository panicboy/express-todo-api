const express  = require('express');
var app = express();
const bodyParser = require('body-parser');
const portNum = process.env.PORT || '3000';


/*  ROUTES  */
var buzz = require ('./routes/buzzword');

/*  MIDDLEWARE  */
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/buzzword', buzz);
app.use('/buzzwords', buzz);
app.use('/reset', buzz);

app.get('/', function(req, res) {
  res.send('Buzzzz!');
});
// var server = app.listen(portNum, function(){
//   var host = server.address().address;
//   var port = portNum;

//   console.log(`Example app listening at http://localhost:${port}`);
// });

//

module.exports = app;