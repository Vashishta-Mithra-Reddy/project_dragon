'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import Head from 'next/head'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true')
    router.push('/dashboard')
  }

  return (
    <>
      <Head>
        <title>Dragon's Realm</title>
        <meta name="description" content="Enter the Dragon's Realm" />
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-red-900 px-4">
        <Card className="w-full max-w-md bg-red-950 border-red-800 text-red-100">
          <CardHeader className="text-center">
            <Image
              src="/project_dragon.png"
              alt="Dragon Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <CardTitle className="text-3xl font-bold mb-2">Enter the Dragon</CardTitle>
            <CardDescription className="text-xl text-red-300">Unleash Your Inner Warrior</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Empty content space maintained for layout consistency */}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleLogin}
              className="w-full bg-red-700 text-red-100 hover:bg-red-600"
            >
              Enter the Dragon's Lair
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
