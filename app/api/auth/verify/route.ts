import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(req: Request) {
  const { token } = await req.json()

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return NextResponse.json({ valid: true, userId: (decoded as any).userId })
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }
}