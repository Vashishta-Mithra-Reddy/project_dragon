import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// In a real application, you would store these in a database
const users = [
  {
    id: 1,
    username: 'karna',
    // This is the hashed version of 'kavachkundal'
    passwordHash: '$2a$10$EMr8S7KjD9diH9/x6Gn.O.a53GKwh2sa3h9S3b4fzR3jgIxOTilfy'
  }
]

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const user = users.find(u => u.username === username)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 })
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })

  return NextResponse.json({ token })
}