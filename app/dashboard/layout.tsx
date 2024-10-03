'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { Menu } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('isLoggedIn')
    if (!token) {
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  }

  const navItems = [
    { href: '/dashboard', label: 'Scroll of Memories' },
    { href: '/dashboard/todo', label: 'Quest Log' },
    { href: '/dashboard/diet', label: 'Dragon\'s Feast' },
    { href: '/dashboard/documents', label: 'Dragon\'s Archives' },
  ]

  return (
    <div className="min-h-screen bg-red-900 text-red-100">
      <nav className="bg-red-950 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex-shrink-0 flex items-center">
                <Image
                  src="/project_dragon.png"
                  alt="Dragon Logo"
                  width={40}
                  height={40}
                  className="rounded-full mr-2"
                />
                <span className="text-xl font-bold">Dragon's Realm</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-red-800 text-red-100'
                      : 'text-red-300 hover:bg-red-800 hover:text-red-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button onClick={handleLogout} variant="outline" className="text-red-100 border-red-500 hover:bg-red-800">
                Exit the Lair
              </Button>
            </div>
            <div className="md:hidden flex items-center">
              <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="outline" className="text-red-100 border-red-500 hover:bg-red-800">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? 'bg-red-800 text-red-100'
                      : 'text-red-300 hover:bg-red-800 hover:text-red-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button onClick={handleLogout} variant="outline" className="w-full text-red-100 border-red-500 hover:bg-red-800 mt-2">
                Exit the Lair
              </Button>
            </div>
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}