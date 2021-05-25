import debug from 'debug'
import { ResponseBody, Encrypter } from '../lib'

const log = debug('app:responseLogs')
const { RESPONSE_LOGS, ENABALE_ENCRYPTION, ENCRYPTION_KEY, ENCRYPTION_IV } = process.env

const sendResponse = async (request, response, next) => {
  let responseBody
  response.sendData = async data => {
    if (RESPONSE_LOGS === 'Y') {
      const responseMsg = { groupName: 'responseLogs', url: request.originalUrl || '', data: data || '' }
      log(JSON.stringify(responseMsg))
    }
    responseBody = new ResponseBody(200, 'OK', data)

    if (ENABALE_ENCRYPTION === 'Y') {
      const payload = await _encryptDataPayLoad(data)
      responseBody = new ResponseBody(200, 'OK', payload)
      const responseMsg = { groupName: 'responseLogs', message: request.originalUrl || '', data: payload || '' }
      log(JSON.stringify(responseMsg))
    }

    return response.status(responseBody.statusCode).json(responseBody)
  }

  response.sendError = async data => {
    const errorMsg = { groupName: 'errorLogs', url: request.originalUrl || '', message: data.message || '', error: data.error || '' }
    log(JSON.stringify(errorMsg))

    const errorBody = new ResponseBody(400, data.message || 'Something went wrong')
    return response.status(errorBody.statusCode).json(errorBody)
  }
  next()
}

async function _encryptDataPayLoad (responseText) {
  const encrypter = new Encrypter(ENCRYPTION_KEY, ENCRYPTION_IV)
  const payload = encrypter.encrypt(responseText)
  return payload
}

export { sendResponse }
