import Express from 'express'
import cors from 'cors'
import { routes } from './routes'
import { errorHandler, requestLogger, setSecurityHeaders } from './lib'
import { sendResponse } from './helpers'

const app = new Express()
const corsOptions = { origin: process.env.CORS_ORIGIN, methods: process.env.CORS_METHODS }

app.use(Express.json({ limit: '50mb' }))
app.use(Express.urlencoded({ extended: true, limit: '50mb' }))

// Cross Origin setup
app.use(cors(corsOptions))

setSecurityHeaders(app)

// log all the request response values in cloudWatch
app.use(requestLogger.init())

// Send response
app.use(sendResponse)

// Route Initialization
routes.init(app)

// Route Error Response Handler
app.use(errorHandler)

export { app }
