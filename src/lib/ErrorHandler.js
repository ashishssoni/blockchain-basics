import debug from 'debug'
import { ResponseBody } from '../lib'

const log = debug('app:error')

const errorHandler = (err, req, res, next) => {
  log(req.originalUrl)

  if (err.name === 'AppError') {
    const errorMsg = { groupName: 'appErrorLogs', message: err.message || '', stack: err.stack || '', errorObj: err, requestBody: req.body }
    log(JSON.stringify(errorMsg))
    const data = { error: err.message }
    if (err.errorData) data.errorData = err.errorData
    const error = new ResponseBody(err.status || 500, err.message || 'Something Wrong !', data)
    return res.status(err.status || 500).json(error)
  }

  // Default handle error
  const errorMsg = { groupName: 'detailErrorLogs', message: err.message || '', stack: err.stack || '', errorObj: err, requestBody: req.body }
  log(JSON.stringify(errorMsg))
  const responseBody = new ResponseBody(err.status || 500, err.message || 'Something broke !', err)
  return res.status(err.status || 500).json(responseBody)
}

export { errorHandler }
