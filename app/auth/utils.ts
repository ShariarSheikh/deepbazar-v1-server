import { SECRET_ACCESS_TOKEN_KEY, SECRET_REFRESH_TOKEN_KEY } from '../config/variables.config'
import jwt from 'jsonwebtoken'
import { RoleType } from '../models/Auth.Model'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

interface CreateAccessToken {
  _id: mongoose.Schema.Types.ObjectId
  role: RoleType[]
}

export function createAccessToken(payload: CreateAccessToken) {
  return jwt.sign(payload, SECRET_ACCESS_TOKEN_KEY, {
    expiresIn: '15m'
  })
}

export function createRefreshToken(payload: CreateAccessToken) {
  return jwt.sign(payload, SECRET_REFRESH_TOKEN_KEY)
}

export function verifiedRefreshToken(token: string) {
  return jwt.verify(token, SECRET_REFRESH_TOKEN_KEY)
}

interface CheckIsAuthorizationProps {
  requiredRoles: RoleType[]
  userRoles: RoleType[]
}

export async function checkIsAuthorization({ requiredRoles, userRoles }: CheckIsAuthorizationProps): Promise<boolean> {
  const requiredRolesSet = new Set(requiredRoles)
  const userRolesSet = new Set(userRoles)

  for (const role of requiredRolesSet) {
    if (!userRolesSet.has(role)) {
      return false
    }
  }

  // If all required roles are present, return true
  return true
}

export async function makePasswordHash(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}
