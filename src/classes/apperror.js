export class AppError extends Error {
  constructor (message, status, data) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.errorData = data
    Error.captureStackTrace(this, AppError)
  }
}
