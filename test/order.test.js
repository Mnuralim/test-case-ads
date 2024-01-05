const request = require('supertest')
const app = require('../src/app')

describe('API order', () => {
  let customerToken
  beforeAll(async () => {
    const loginCustomer = await request(app).post('/api/v1/auths/customer-login').send({
      username: 'user3',
      password: '123456',
    })
    customerToken = loginCustomer.body.data.accessToken
  })
  describe('Creat order by cart', () => {
    it('Should return a 200 status code and return message :"Success create order"', async () => {
      const { statusCode, body } = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
      expect(statusCode).toBe(200)
      expect(body.message).expect('Success create order')
    })
  })
})
