import { Prisma } from './generated/prisma'

const jwt = require('jsonwebtoken')

const APP_SECRET = 'appsecret321'

function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new AuthError()
}

class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}

export interface Context {
  db: Prisma
  request: any
}

module.exports = {
  getUserId,
  AuthError,
  APP_SECRET,
}