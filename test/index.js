'use strict';
const supertest = require('supertest');
const app = require('../server');
const bodyParser = require('body-parser');
const sTest = supertest(app);



describe('/get', ()=> {
  it('should return status code 200 if successful',(done) => {
    sTest
      .get('/')
      .expect(200,done);
  });
});