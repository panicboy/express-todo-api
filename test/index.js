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
    it('should create a new buzzWord and set its points value', (done)=>{

      let payload = {
        buzzWord : 'Agile is amazing',
        points : 1000
      };

      agent.post('/buzzword')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(payload)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => res.body.hasOwnProperty('success') && res.body.success == 'true')
        .end(() => {
          agent.post('/buzzword')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(payload)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => res.body.hasOwnProperty('success') && res.body.success == 'false')
            .end(done);

        });
    });
  });
});
