import crypto from 'crypto'
class Encrypter {
  constructor (encryptionkey, iv) {
    this.algorithm = 'aes-256-gcm'
    this.key = encryptionkey.substr(0, 32)
    this.iv = Buffer.from(iv, 'base64')
    this.tagLength = 16
  }

  encrypt (data) {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv)
    let cipherText = cipher.update(JSON.stringify(data), 'utf8')
    cipherText = Buffer.concat([cipherText, cipher.final()])
    const tag = cipher.getAuthTag()
    const encryptedData = Buffer.concat([cipherText, tag])

    return Buffer.from(encryptedData).toString('base64')
  }

  decrypt (encryptedData) {
    const encryptedBuffer = Buffer.from(encryptedData, 'base64')
    const cipherText = encryptedBuffer.slice(0, encryptedBuffer.length - this.tagLength)
    const tag = encryptedBuffer.slice(-this.tagLength)
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv)
    decipher.setAuthTag(tag)
    let data = decipher.update(cipherText, 'base64', 'utf8')
    data += decipher.final('utf8')

    return JSON.parse(data)
  }
}

export { Encrypter }
