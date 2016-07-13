# Buzz Word Bingo
**About the game**

Before a meeting the players are asked to enter words with point values. A player can enter a total of **5 words at most**. Once a meeting starts if a word that the player previously entered is heard during a meeting that player can mark that word and score the points increasing their score. Each time the player scores a new word the total increases by the point value.

# Welcome to Team Buzz™
Our game has been getting a lot of traction and we need to rebuild the API server with NodeJS
to handle all the connections, we need you to create the server using **ExpressJS**. Our CTO will provide you with
the specs below.

**At this time:**
- you will not build the front-end.
- you will not implement a database.

## The Specs
We like RESTful architechure. We like CRUD. As always, data will be sent to the server as `x-www-form-urlencoded`.

### Buzz word object
This is how your objects should look like after receiving a `POST` to the uri `/buzzword`

```javascript
{
  buzzWord: String,
  score: Number
  heard: false
}
```

You will store these objects in memory for the time being. Meaning that if the **server** crashes and after restarting and listening again, your app will have no buzzWord objects, no collection containing buzzWord objects, no scores, nada.

### Functionality
A global variable will keep track of a single score; this is not a multi-player game (yet). The score will be incremented and decremented using a PUT request, which looks like this: `{ "buzzWord": String, "heard": Bool }` If `heard` is `true` and the buzzWord is in our list, the score will be incremented using the points assigned to the buzzWord. If `heard` is `false`, the score will be decremented by the point value of the buzzWord object. In either case, the `heard` property of an existing buzzWord object will be updated to match the incoming request and the response will include the updated score.

**Routes overview table:**

| **METHOD** **ROUTE (uri)** | **BODY** | **RESPONSE** | **Action** |
|---|---|---|---|
| `GET /` | empty | render HTML `index.html` | serves the `index.html` |
| `GET /buzzwords` | empty | `{ "buzzWords": [...] }` A JSON response containing an array of current buzzWord objects | Retrieves all buzzWords |
| `POST /buzzword` | `{ "buzzWord": String, "points": Number }` | `{ "success": true }` | Creates a new buzzWord object. Returns `true` if successful else `false`. A new buzzWord object should have a default `heard` value of `false`.|
| `PUT /buzzword` | `{ "buzzWord": String, "heard": Bool }` |  `{ "success": true, newScore: Number }` | Updates a buzzWord object and increments or decrements the score. Returns `true` and the new score if successful, otherwise returns just `false` |
| `DELETE /buzzword` | `{ "buzzWord": String }` | `{ "success": true }` | Delete a buzzWord object. Returns `true` if successful else `false` |
| `POST /reset` | `{ "reset": true }` | `{ "success": true }` | Resets the server. All buzzWord objects are removed and the score is reset to `0` |

## Routes detailed
`GET /`: Serves the static file `index.html` which should be located in your `public/` directory. For now just have a stub HTML file.

`GET /buzzwords`: Returns a JSON response containing single key, `buzzWords` which will be an array containing objects (see [buzzWord Object Section](https://gist.github.com/sgnl/378bd9b54c566f0f22ef#buzz-word-object) for details)

`POST /buzzword`: Creates a new buzzWord object. The body **should** have these keys:
  - `buzzWord` which contains the buzz word as a `String` and
  - `points` property is how many points that word is worth when scored; this value is of data-type `Number`.
  Example:
  if `{ "buzzWord": "Agile is amazing", "score": 1000 }` is sent to this route then the server will create a new [buzzWord object](https://github.com/expressjs/body-parser#bodyparserurlencodedoptions) and add it to a collection.

`PUT /buzzword`:  Updates a buzzWord object's `heard` property. The body **should** contain these keys:
  - `buzzWord` which is the buzzWord object to modify.
  - `heard` updates the value of the buzzWord object's `heard` property.

  **Example:**
  if `{ "buzzWord": "Social-Mobile", "heard": true }` is sent to this route then the server will find the buzzWord object whose `buzzWord` property is "Social-Mobile" and change it's `heard` property to `true`. It will increase the global score by the number of points assigned to "Social-Mobile". Similarly, `{ "buzzWord": "Social-Mobile", "heard": false }` would decrease the global score by the `points` property of that buzzWord object and change the object's `heard` property to `false`. In each case, the updated score would be sent as part of the response.

`DELETE /buzzword`: Deletes a buzzWord object from the collection.

`POST /reset`: Clears the list of saved buzzWord objects and zeroes out the score. Be sure to test that the request is sent to the `/reset` uri using the `POST` method, and that the request body matches the spec.


## Middleware to use
[Body-Parser](https://github.com/expressjs/body-parser) - Use this module to help parse the `data` coming from a request. Focus on the **[urlencodedoptions](https://github.com/expressjs/body-parser#bodyparserurlencodedoptions)** section of the README, use the `extended: true` option. Take some time to scan through the documentation. What is `body-parser` module doing for us? Is this module doing something we previously had to do manually?

## Getting Started
1. Create your own directory for this project, name it `express-todo-api`.
1. You'll be using `git` and `npm` so be sure to **initialize** those tools before you use them.
1. Install the packages you need
1. Use **Postman** to test your routes.
1. Remember to commit often!
