const request = require('supertest')
const app = require('../src/app')

describe('API cart', () => {
  let productData
  let customerToken
  beforeAll(async () => {
    const products = await request(app).get('/api/v1/products')
    productData = products.body.data[0]
    console.log(productData.id)

    const loginCustomer = await request(app).post('/api/v1/auths/customer-login').send({
      username: 'user3',
      password: '123456',
    })
    customerToken = loginCustomer.body.data.accessToken
  })
  describe('create cart', () => {
    it('Should return a 200 status code and return message :"Success add product to cart"', async () => {
      const payload = {
        productId: productData.id,
        quantity: 1,
      }

      const { statusCode, body } = await request(app)
        .post('/api/v1/carts')
        .send(payload)
        .set('Authorization', `Bearer ${customerToken}`)

      expect(statusCode).toBe(200)
      expect(body.message).toBe('Success add product to cart')
    })

    it('Should return a 200 status code and return message :"Product quantity updated in cart"', async () => {
      const payload = {
        productId: productData.id,
        quantity: 1,
      }

      const { statusCode, body } = await request(app)
        .post('/api/v1/carts')
        .send(payload)
        .set('Authorization', `Bearer ${customerToken}`)

      expect(statusCode).toBe(200)
      expect(body.message).toBe('Product quantity updated in cart')
    })

    it('Should return a 404 status code and return message :"Product not found"', async () => {
      const payload = {
        productId: 2000,
        quantity: 1,
      }

      const { statusCode, body } = await request(app)
        .post('/api/v1/carts')
        .send(payload)
        .set('Authorization', `Bearer ${customerToken}`)

      expect(statusCode).toBe(404)
      expect(body.message).toBe('Product not found')
    })

    it('Should return a 400 status code and return message :"Product out of stock"', async () => {
      const payload = {
        productId: productData.id,
        quantity: 50,
      }

      const { statusCode, body } = await request(app)
        .post('/api/v1/carts')
        .send(payload)
        .set('Authorization', `Bearer ${customerToken}`)

      expect(statusCode).toBe(400)
      expect(body.message).toBe('Product out of stock')
    })
  })
})
