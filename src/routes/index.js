import debug from 'debug'
import { ResponseBody } from '../lib'
import { AppError } from '../classes'
import { ideaRouter } from './idea'

const log = debug('app:index')

const routes = [
  { path: '/idea', router: ideaRouter }
]

routes.init = function (app) {
  if (!app || !app.use) {
    log('[Error] Route Initialization Failed: app / app.use is undefined')
    return process.exit(1)
  }

  routes.forEach(function (route) { app.use(route.path, route.router) })

  app.get('/version', (request, response, next) => {
    const version = process.env.npm_package_version
    const data = { version }
    const responseBody = new ResponseBody(200, 'OK', data)
    response.status(responseBody.statusCode).json(responseBody)
  })

  // Health Check API
  app.get('/health-check', (request, response, next) => {
    const responseBody = new ResponseBody(200, 'OK')
    response.status(responseBody.statusCode).json(responseBody)
  })

  app.options((request, response, next) => { throw new AppError('Not Found', 404) })

  // Route Not Found Error Handling
  app.use((request, response, next) => { throw new AppError('No route found', 404) })
}

export { routes }
