import morgan from 'morgan'

function LOG_PARAMS (tokens, req, res) {
  const log = {
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    'status-code': tokens.status(req, res),
    'response-message': tokens['response-message'](req, res),
    'response-time': tokens['response-time'](req, res) + ' ms',
    timestamp: tokens.date(req, res, 'iso'),
    'remote-address': tokens['remote-addr'](req, res),
    referrer: tokens.referrer(req, res),
    'user-agent': tokens['user-agent'](req, res),
    'request-body': tokens['request-body'](req, res),
    user: tokens.user(req, res)
  }

  if (!log) { return (log && JSON.stringify(log)) || undefined }
  return (log && JSON.stringify(log)) || undefined
}

class Logger {
  constructor (options) {
    options = options || {}
    this.options = options
    this.REQUEST_BODY_BLACKLIST_KEYS = options.REQUEST_BODY_BLACKLIST_KEYS || []
    this.init = this.init.bind(this)
    this._extendMorganTokens = this._extendMorganTokens.bind(this)
  }
}

Logger.prototype.init = function () {
  this._extendMorganTokens()
  return morgan(LOG_PARAMS)
}

Logger.prototype._extendMorganTokens = function () {
  const _this = this
  morgan.token('response-message', function (req, res) {
    return res.statusMessage
  })

  morgan.token('request-body', function (req, res) {
    const reqBody = JSON.parse(JSON.stringify(req.body))

    // Sanitize Request Body based on Blacklist Keys
    _this.REQUEST_BODY_BLACKLIST_KEYS.forEach(function (key) {
      delete reqBody[key]
    })

    return reqBody
  })

  morgan.token('user', function (req, res) {
    return req.user || undefined
  })
}

const loggerOptions = {
  REQUEST_BODY_BLACKLIST_KEYS: ['Password']
}

const requestLogger = new Logger(loggerOptions)

export { requestLogger }
