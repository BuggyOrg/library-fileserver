/* global describe, it */

import chai from 'chai'
import chaiHttp from 'chai-http'
import {serve} from '../src/restAPI'
// import _ from 'lodash'

chai.use(chaiHttp)
var expect = chai.expect

describe('Configuration', () => {
  it('get configuration settings', () => {
    return chai.request(serve({config: {c: 2}}))
      .get('/config/c')
      .then((res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.equal(2)
      })
  })

  it('sets configuration settings', () => {
    var app = serve({config: {}})
    return chai.request(app)
      .post('/config/d')
      .send({value: 4})
      .then((res) => {
        expect(res.status).to.equal(204)
      })
      .then(() => chai.request(app).get('/config/d'))
      .then((res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.equal(4)
      })
  })

  it('errors if the post value is invalid', () => {
    var app = serve({config: {}})
    return chai.request(app)
      .post('/config/d')
      .send({X: 4})
      .then((res) => {
        expect(res.status).to.equal(400)
      })
      .catch((err) => {
        expect(err).to.be.ok
      })
  })
})
