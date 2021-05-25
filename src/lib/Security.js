import helmet from 'helmet'

function setSecurityHeaders (app) {
  app.disable('etag')
  app.disable('x-powered-by')

  app.use(helmet({
    hsts: false
  }))

  app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }))

  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ['\'self\'']
    }
  }))
}

export { setSecurityHeaders }
