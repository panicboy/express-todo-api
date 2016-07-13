var express  = require('express');
var app = express();


/*  ROUTES  */
var buzz = require ('./routes/buzzword');

/*  MIDDLEWARE  */
app.use(express.static('public'));
app.use('/buzzword', buzz);
app.use('/buzzwords', buzz);

app.get('/', function(req, res) {
  res.send('Buzzzz!');
});


var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Example app listening at http://localhost:${port}`);
});