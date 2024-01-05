const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const swaggerUI = require('swagger-ui-express')

const swaggerDocument = require('./docs/swagger.json')
const errorHandler = require('./controllers/errorHandler')
const ApiError = require('./utils/apiError')
const router = require('./routes')

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use(router)

app.use('/api-docs', swaggerUI.serve)
app.use('/api-docs', swaggerUI.setup(swaggerDocument))

app.all('*', (req, res, next) => {
  next(new ApiError(`Routes does not exist`, 404))
})
app.use(errorHandler)

module.exports = app
