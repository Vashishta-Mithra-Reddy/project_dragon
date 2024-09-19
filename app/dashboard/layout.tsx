'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-red-900 text-red-100">
      <nav className="bg-red-950 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/dashboard" className="flex-shrink-0 flex items-center text-xl font-bold">
                Dragon's Realm
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/dashboard" className="border-red-500 text-red-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Scroll of Memories
                </Link>
                <Link href="/dashboard/todo" className="border-transparent text-red-300 hover:text-red-100 hover:border-red-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Quest Log
                </Link>
                <Link href="/dashboard/diet" className="border-transparent text-red-300 hover:text-red-100 hover:border-red-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dragon's Feast
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Button onClick={handleLogout} variant="outline" className="text-red-100 border-red-500 hover:bg-red-800">
                Exit the Lair
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}