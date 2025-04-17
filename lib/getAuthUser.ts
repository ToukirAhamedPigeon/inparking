// lib/getAuthUser.ts
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.ACCESS_SECRET || 'your-secret-key'
const COOKIE_NAME = 'inparking_access_token'

export async function getAuthUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    return decoded.id
  } catch (error) {
    console.error('Invalid token:', error)
    return null
  }
}
