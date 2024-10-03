import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// This would typically be stored in a database
const userDocuments: { [userId: number]: { id: string; name: string; uploadDate: string; size: string }[] } = {}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    const documents = userDocuments[decoded.userId] || []
    return NextResponse.json({ documents })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}