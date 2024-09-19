'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'karna' && password === 'kavachkundal') {
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-900">
      <Card className="w-[400px] bg-red-950 border-red-800 text-red-100">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">Enter the Dragon</CardTitle>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-red-900/50 border-red-800 text-red-100 placeholder-red-400"
                placeholder="Warrior's Name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-red-900/50 border-red-800 text-red-100 placeholder-red-400"
                placeholder="Secret Mantra"
              />
            </div>
            {error && <p className="text-red-300 text-sm">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-red-700 text-red-100 hover:bg-red-600">
              Enter the Dragon's Lair
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}