const request = require('supertest')
const app = require('../src/app')

describe('API auth', () => {
  let customerToken
  let sellerToken
  beforeAll(async () => {
    const user1 = {
      email: 'testing@gmail.com',
      password: '123456',
      name: 'test',
      username: 'testing123',
      mobile: '0873636',
    }
    const user2 = {
      email: 'testing2@gmail.com' + Math.floor(Math.random() * 9000),
      password: '123456',
      name: 'testing2' + Math.floor(Math.random() * 9000),
      username: 'testing21234' + Math.floor(Math.random() * 9000),
      mobile: '0873636',
    }
    const user3 = {
      email: 'user3gmail.com',
      password: '123456',
      name: 'user3',
      username: 'user3',
      mobile: '08736369393',
    }

    await request(app).post('/api/v1/auths/customer-register').send(user1)
    await request(app).post('/api/v1/auths/customer-register').send(user2)
    await request(app).post('/api/v1/auths/customer-register').send(user3)
    const loginSeller = await request(app).post('/api/v1/auths/customer-login').send({
      username: user1.username,
      password: user1.password,
    })
    sellerToken = loginSeller.body.data.accessToken
    await request(app).patch('/api/v1/auths/seller-register').set('Authorization', `Bearer ${sellerToken}`)

    const loginCustomer = await request(app).post('/api/v1/auths/customer-login').send({
      username: user2.username,
      password: user2.password,
    })

    customerToken = loginCustomer.body.data.accessToken
  })
  describe('registration customer', () => {
    it('Should return a 201 status code and return message :"customer account created"', async () => {
      const payload = {
        email: 'test@gmail.com' + Math.floor(Math.random() * 9000),
        password: '123456',
        name: 'test',
        username: 'test123' + Math.floor(Math.random() * 9000),
        mobile: '0873636',
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/customer-register').send(payload)
      expect(statusCode).toBe(201)
      expect(body.message).toBe('customer account created')
    })
    it('Should return a 400 status code and return message :"all fields are required"', async () => {
      const payload = {
        email: 'test@gmail.com' + Math.floor(Math.random() * 9000),
        password: '123456',
        name: 'test',
        username: 'test123' + Math.floor(Math.random() * 9000),
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/customer-register').send(payload)
      expect(statusCode).toBe(400)
      expect(body.message).toBe('all fields are required')
    })

    it('Should return a 400 status code and return message :"password must be more than 6 characters"', async () => {
      const payload = {
        email: 'test@gmail.com' + Math.floor(Math.random() * 9000),
        password: '12345',
        name: 'test',
        mobile: '0873636',
        username: 'test123' + Math.floor(Math.random() * 9000),
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/customer-register').send(payload)
      expect(statusCode).toBe(400)
      expect(body.message).toBe('password must be more than 6 characters')
    })

    it('Should return a 400 status code and return message :"email already exist"', async () => {
      const payload = {
        email: 'testing@gmail.com',
        password: '123456',
        name: 'test',
        mobile: '0873636',
        username: 'test123' + Math.floor(Math.random() * 9000),
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/customer-register').send(payload)
      expect(statusCode).toBe(400)
      expect(body.message).toBe('email already exist')
    })
    it('Should return a 400 status code and return message :"username already exist"', async () => {
      const payload = {
        email: 'test@gmail.com' + Math.floor(Math.random() * 9000),
        password: '123456',
        name: 'test',
        mobile: '0873636',
        username: 'testing123',
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/customer-register').send(payload)
      expect(statusCode).toBe(400)
      expect(body.message).toBe('username already exist')
    })
  })

  describe('Login customer', () => {
    it('Should return a 200 status code and return message :"login success"', async () => {
      const payload = {
        password: '123456',
        username: 'testing123',
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/customer-login').send(payload)
      expect(statusCode).toBe(200)
      expect(body.message).toBe('login success')
    })

    it('Should return a 400 status code and return message :"all fields are required"', async () => {
      const payload = {
        password: '123456',
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/customer-login').send(payload)
      expect(statusCode).toBe(400)
      expect(body.message).toBe('all fields are required')
    })

    it('Should return a 400 status code and return message :"customer not found"', async () => {
      const payload = {
        username: 'not_found_username',
        password: '123456',
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/customer-login').send(payload)
      expect(statusCode).toBe(404)
      expect(body.message).toBe('customer not found')
    })

    it('Should return a 400 status code and return message :"password is incorrect"', async () => {
      const payload = {
        username: 'testing123',
        password: '12345678',
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/customer-login').send(payload)
      expect(statusCode).toBe(400)
      expect(body.message).toBe('password is incorrect')
    })
  })

  describe('registration seller', () => {
    it('Should return a 201 status code and return message :"seller account created"', async () => {
      const { statusCode, body } = await request(app)
        .patch('/api/v1/auths/seller-register')
        .set('Authorization', `Bearer ${customerToken}`)
      expect(statusCode).toBe(201)
      expect(body.message).toBe('seller account created')
    })
    it('Should return a 400 status code and return message :"This account has become a seller"', async () => {
      const { statusCode, body } = await request(app)
        .patch('/api/v1/auths/seller-register')
        .set('Authorization', `Bearer ${sellerToken}`)
      expect(statusCode).toBe(400)
      expect(body.message).toBe('This account has become a seller')
    })
  })

  describe('login seller', () => {
    it('Should return a 200 status code and return message :"login success"', async () => {
      const payload = {
        username: 'testing123',
        password: '123456',
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/seller-login').send(payload)
      expect(statusCode).toBe(200)
      expect(body.message).toBe('login success')
    })
    it('Should return a 400 status code and return message :"all fields are required"', async () => {
      const payload = {
        password: '123456',
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/seller-login').send(payload)
      expect(statusCode).toBe(400)
      expect(body.message).toBe('all fields are required')
    })
    it('Should return a 400 status code and return message :"password is incorrect"', async () => {
      const payload = {
        username: 'testing123',
        password: '12345678',
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/seller-login').send(payload)
      expect(statusCode).toBe(400)
      expect(body.message).toBe('password is incorrect')
    })

    it('Should return a 404 status code and return message :"seller not found"', async () => {
      const payload = {
        username: 'usernam_notfound',
        password: '12345678',
      }

      const { statusCode, body } = await request(app).post('/api/v1/auths/seller-login').send(payload)
      expect(statusCode).toBe(404)
      expect(body.message).toBe('seller not found')
    })
  })
})
