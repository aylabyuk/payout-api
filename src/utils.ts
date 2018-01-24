import { Prisma } from './generated/prisma'
const jwt = require('jsonwebtoken')

export const APP_SECRET = 'appsecret321'

export function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization')
  
  if (Authorization && Authorization !== "null") {
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
