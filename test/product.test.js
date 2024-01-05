const request = require('supertest')
const app = require('../src/app')

describe('API product', () => {
  let sellerToken
  let customerToken
  let productId
  beforeAll(async () => {
    const loginSeller = await request(app).post('/api/v1/auths/seller-login').send({
      username: 'testing123',
      password: '123456',
    })
    const loginCustomer = await request(app).post('/api/v1/auths/customer-login').send({
      username: 'user3',
      password: '123456',
    })
    sellerToken = loginSeller.body.data.accessToken
    customerToken = loginCustomer.body.data.accessToken

    const products = await request(app).get('/api/v1/products')

    productId = products.body.data[0].id
  })
  describe('Create Product', () => {
    it('Should return a 201 status code and return message :"product created"', async () => {
      const payload = {
        title: 'test product',
        description: 'this is product description',
        price: 300,
        stock: 20,
      }

      const { body, statusCode } = await request(app)
        .post('/api/v1/products')
        .send(payload)
        .set('Authorization', `Bearer ${sellerToken}`)

      expect(statusCode).toBe(201)
      expect(body.message).toBe('product created')
    })

    it('Should return a 400 status code and return message :"all fields are required"', async () => {
      const payload = {
        title: 'test product',
        description: 'this is product description',
        price: 300,
      }

      const { body, statusCode } = await request(app)
        .post('/api/v1/products')
        .send(payload)
        .set('Authorization', `Bearer ${sellerToken}`)

      expect(statusCode).toBe(400)
      expect(body.message).toBe('all fields are required')
    })

    it('Should return a 401 status code and return message :"Unauthorized, Login please!"', async () => {
      const payload = {
        title: 'test product',
        description: 'this is product description',
        price: 300,
        stock: 20,
      }

      const { body, statusCode } = await request(app).post('/api/v1/products').send(payload)

      expect(statusCode).toBe(401)
      expect(body.message).toBe('Unauthorized, Login please!')
    })

    it('Should return a 403 status code and return message :"acccess forbidden, your role is not seller"', async () => {
      const payload = {
        title: 'test product',
        description: 'this is product description',
        price: 300,
        stock: 20,
      }

      const { body, statusCode } = await request(app)
        .post('/api/v1/products')
        .send(payload)
        .set('Authorization', `Bearer ${customerToken}`)

      expect(statusCode).toBe(403)
      expect(body.message).toBe('acccess forbidden, your role is not seller')
    })
  })

  describe('Update Product', () => {
    it('Should return a 200 status code and return message :"product updated"', async () => {
      const payload = {
        title: 'test product update',
        description: 'this is product description',
        price: 300,
        stock: 20,
      }

      const { body, statusCode } = await request(app)
        .patch('/api/v1/products/1')
        .send(payload)
        .set('Authorization', `Bearer ${sellerToken}`)

      expect(statusCode).toBe(200)
      expect(body.message).toBe('product updated')
    })

    it('Should return a 401 status code and return message :"Unauthorized, Login please!"', async () => {
      const payload = {
        title: 'test product update',
        description: 'this is product description',
        price: 300,
        stock: 20,
      }

      const { body, statusCode } = await request(app).patch('/api/v1/products/1').send(payload)

      expect(statusCode).toBe(401)
      expect(body.message).toBe('Unauthorized, Login please!')
    })

    it('Should return a 403 status code and return message :"acccess forbidden, your role is not seller"', async () => {
      const payload = {
        title: 'test product',
        description: 'this is product description',
        price: 300,
        stock: 20,
      }

      const { body, statusCode } = await request(app)
        .patch('/api/v1/products/1')
        .send(payload)
        .set('Authorization', `Bearer ${customerToken}`)

      expect(statusCode).toBe(403)
      expect(body.message).toBe('acccess forbidden, your role is not seller')
    })

    it('Should return a 404 status code and return message :"product not found or you are not owner this product"', async () => {
      const payload = {
        title: 'test product update',
        description: 'this is product description',
        price: 300,
        stock: 20,
      }

      const { body, statusCode } = await request(app)
        .patch('/api/v1/products/200000')
        .send(payload)
        .set('Authorization', `Bearer ${sellerToken}`)

      expect(statusCode).toBe(404)
      expect(body.message).toBe('product not found or you are not owner this product')
    })
  })

  describe('Delete Product', () => {
    it('Should return a 200 status code and return message :"product deleted"', async () => {
      const { body, statusCode } = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${sellerToken}`)

      expect(statusCode).toBe(200)
      expect(body.message).toBe('product deleted')
    })

    it('Should return a 401 status code and return message :"Unauthorized, Login please!"', async () => {
      const { body, statusCode } = await request(app).delete(`/api/v1/products/${productId}`)
      expect(statusCode).toBe(401)
      expect(body.message).toBe('Unauthorized, Login please!')
    })

    it('Should return a 403 status code and return message :"acccess forbidden, your role is not seller"', async () => {
      const { body, statusCode } = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${customerToken}`)

      expect(statusCode).toBe(403)
      expect(body.message).toBe('acccess forbidden, your role is not seller')
    })

    it('Should return a 404 status code and return message :"product not found or you are not owner this product"', async () => {
      const { body, statusCode } = await request(app)
        .delete('/api/v1/products/200000')
        .set('Authorization', `Bearer ${sellerToken}`)

      expect(statusCode).toBe(404)
      expect(body.message).toBe('product not found or you are not owner this product')
    })
  })

  describe('get all Products', () => {
    it('Should return a 200 status code', async () => {
      const { statusCode } = await request(app).get('/api/v1/products')

      expect(statusCode).toBe(200)
    })
    it('Should return a 200 status code', async () => {
      const { statusCode } = await request(app).get('/api/v1/products/?sellerUsername=testing123')

      expect(statusCode).toBe(200)
    })
  })

  describe('get Product by id', () => {
    it('Should return a 200 status code', async () => {
      console.log(productId)
      const { statusCode } = await request(app).get(`/api/v1/products/${productId + 1}`)

      expect(statusCode).toBe(200)
    })
    it('Should return a 404 status code', async () => {
      const { statusCode } = await request(app).get('/api/v1/products/2980')

      expect(statusCode).toBe(404)
    })
  })
})
