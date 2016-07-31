/* global describe, it */

import chai from 'chai'
import chaiHttp from 'chai-http'
import {serve} from '../src/restAPI'
// import _ from 'lodash'

chai.use(chaiHttp)
var expect = chai.expect

describe('Components', () => {
  it('exposes basic information', () => {
    return chai.request(serve({}))
      .get('/info')
      .then((res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.be.ok
      })
  })

  it('gets the number of components', () => {
    return chai.request(serve({components: []}))
      .get('/components/count')
      .then((res) => {
        expect(res.body).to.equal(0)
      })
      .then(() => chai.request(serve({components: [{meta: 1}, {meta: 2}]}))
        .get('/components'))
      .then((res) => {
        expect(res.body).to.eql([1, 2])
      })
  })

  it('can query a specific component', () => {
    return chai.request(serve({components: [{meta: 'a', value: 1, version: '0.1.0'}, {meta: 'b', value: 2, version: '1.0.0'}]}))
      .get('/components/get/a')
      .then((res) => {
        expect(res.body.value).to.equal(1)
      })
  })

  it('can query a specific component with a given version', () => {
    return chai.request(serve({components: [{meta: 'a', value: 1, version: '0.1.0'}, {meta: 'a', value: 2, version: '0.2.0'}]}))
      .get('/components/get/a/version/0.2.0')
      .then((res) => {
        expect(res.body.value).to.equal(2)
      })
  })

  it('sends an error code if the specific component with a given version does not exist', () => {
    return chai.request(serve({components: [{meta: 'a', value: 1, version: '0.1.0'}, {meta: 'a', value: 2, version: '0.2.0'}]}))
      .get('/components/get/a/version/0.1.2')
      .then((res) => {
        expect(false).to.be.true
      })
      .catch((err) => {
        expect(err.status).to.equal(404)
      })
  })

  it('sends an error code if the component does not exist', () => {
    return chai.request(serve({components: []}))
      .get('/components/get/b')
      .then((res) => {
        expect(false).to.be.true
      })
      .catch((err) => {
        expect(err.status).to.equal(404)
      })
  })

  it('inserts new components', () => {
    var app = serve({components: []})
    return chai.request(app)
      .post('/components')
      .send({meta: 'a', ports: [{}], version: '1.0.0'})
      .then((res) => {
        expect(res.status).to.equal(204)
      })
      .then(() => chai.request(app).get('/components/count'))
      .then((res) => expect(res.body).to.equal(1))
  })

  it('inserting an invalid component gives a 400 status code', () => {
    var app = serve({components: []})
    return chai.request(app)
      .post('/components')
      .send({meta: 'a', ports: [{}]})
      .then((res) => {
        expect(false).to.be.true
      })
      .catch((err) => {
        expect(err.status).to.equal(400)
      })
  })

  it('updates a component', () => {
    var app = serve({components: [{meta: 'b'}, {meta: 'a', value: 1, version: '0.1.0'}, {meta: 'c'}]})
    return chai.request(app)
      .post('/components')
      .send({meta: 'a', value: 2, ports: [{}], version: '0.2.0'})
      .then((res) => {
        expect(res.status).to.equal(204)
      })
      .then(() => chai.request(app).get('/components/get/a'))
      .then((res) => expect(res.body.value).to.equal(2))
  })
})