var express  = require('express');
var Router = express.Router();
var buzzwordList = [];

// Router.get('/counter', (req, res) => {
//   res.send(`counter is currently ${counter}`);
// });

// Router.get('/', (req, res) => {
//   res.send(`counter is currently ${counter}`);
// });

Router.post('/', (req, res) => {
  console.log('req: ', req);
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