'use strict';
const supertest = require('supertest');
const chai = require('chai');
chai.should();
const app = require('../server');
const bodyParser = require('body-parser');
const agent = supertest.agent(app);
const sTest = supertest(app);


// describe('/get', ()=> {
//   it('should return status code 200 if successful',(done) => {
//     sTest
//       .get('/')
//       .expect(200,done);
//   });
// });

describe('Buzzword Bingo app', () => {

  describe('POST /buzzword', () => {

    var payload1 = {
      buzzWord : 'Agile is amazing',
      points : 1000
    };

    var payload2 = {
      buzzWord : 'Agile is amazing'
    };

    var payload3 = {
      points : 1000
    };

    var payload4 = {
      buzzWord : 'Agile is amazing',
      points : 'go fish'
    };

    it('should create a new buzzWord and set its points value', (done)=>{
      agent.post('/buzzword')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(payload1)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => res.body.hasOwnProperty('success') && res.body.success == 'false')
        .end(done);
    });

    it(`a second post with the same buzzWord should get a response {success : false}`, (done)=>{
     agent.post('/buzzword')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(payload1)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => res.body.hasOwnProperty('success') && res.body.success == 'true')
      .end(() => {
        agent.post('/buzzword')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(payload1)
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(res => res.body.hasOwnProperty('success') && res.body.success == 'false')
          .end(done);
      });
    });

    it('a new buzzWord without a points value should fail', (done)=>{
      agent.post('/buzzword')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(payload2)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => res.body.hasOwnProperty('success') && res.body.success == 'false')
        .end(done);
    });

    it('a new buzzWord with only a points value should fail', (done)=>{
      agent.post('/buzzword')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(payload3)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => res.body.hasOwnProperty('success') && res.body.success == 'false')
        .end(done);
    });

    it('a new buzzWord with a non-numeric points value should fail', (done)=>{
      agent.post('/buzzword')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(payload4)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => res.body.hasOwnProperty('success') && res.body.success == 'false')
        .end(done);
    });

  });
});
