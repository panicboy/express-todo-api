var express  = require('express');
var app = express();


/*  ROUTES  */
var buzzWord = require ('./routes/buzzword');

/*  MIDDLEWARE  */
app.use(express.static('public'));
app.use('/buzzword', buzzWord);

app.get('/', function(req, res) {
  res.send('Hello world!');
});


var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Example app listening at http://localhost:${port}`);
});