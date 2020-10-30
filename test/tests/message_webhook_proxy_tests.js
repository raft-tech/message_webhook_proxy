process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let request = require('request');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../message_webhook_proxy');
let should = chai.should();
chai.use(chaiHttp);

describe('Health Check', () => {
    it('it should GET a status code 200', (done) => {
      chai.request(server)
          .get('/')
          .end((err, res) => {
                res.should.have.status(200);
            done();
          });
    });
});

describe('Empty post Endpoint', () => {
    it('it should GET a status code 404', (done) => {
      chai.request(server)
          .get('/post')
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
    });
});

let garbage_string = Math.random().toString(36).slice(2);
describe('Grabage Endpoint ('+garbage_string+')', () => {
    it('it should GET a status code 404', (done) => {
      chai.request(server)
          .get('/'+garbage_string)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
    });
});

///post/channel/<channel_id>/msg/<message>
describe('Post with empty channel', () => {
    it('it should GET a status code 404', (done) => {
      chai.request(server)
          .get('/post/channel/')
          .end((err, res) => {
                res.should.have.status(404);
            done();
          });
    });
});

describe('Post with empty msg', () => {
    it('it should GET a status code 404', (done) => {
      chai.request(server)
          .get('/post/msg/')
          .end((err, res) => {
                res.should.have.status(404);
            done();
          });
    });
});

describe('Post with empty channel and msg', () => {
    it('it should GET a status code 404', (done) => {
      chai.request(server)
          .get('/post/channel/msg/')
          .end((err, res) => {
                res.should.have.status(404);
            done();
          });
    });
});

describe('Post with empty channel and msg', () => {
    it('it should GET a status code 404', (done) => {
      chai.request(server)
          .get('/post/msg/channel/')
          .end((err, res) => {
                res.should.have.status(404);
            done();
          });
    });
});

let garbage_channel = Math.random().toString(36).slice(2);
describe('Post with garbage channel (garbage_channel)', () => {
    it('it should GET a status code 404', (done) => {
      chai.request(server)
          .get('/post/channel/'+garbage_channel)
          .end((err, res) => {
                res.should.have.status(404);
            done();
          });
    });
});

let garbage_msg = Math.random().toString(36).slice(2);
describe('Post with garbage msg (garbage_msg)', () => {
    it('it should GET a status code 404', (done) => {
      chai.request(server)
          .get('/post/msg/'+garbage_msg)
          .end((err, res) => {
                res.should.have.status(404);
            done();
          });
    });
});

describe('Post with garbage channel and msg (garbage_channel,garbage_msg)', () => {
    it('it should GET a status code 403', (done) => {
      chai.request(server)
          .post('/post/channel/'+garbage_channel+'/msg/'+garbage_msg)
          .end((err, res) => {
            res.should.have.status(500);
            done();
          });
    });
});
