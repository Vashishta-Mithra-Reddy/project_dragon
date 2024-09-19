'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface DiaryEntry {
  id: number;
  content: string;
  timestamp: string;
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [newEntry, setNewEntry] = useState('')

  useEffect(() => {
    const storedEntries = localStorage.getItem('diaryEntries')
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [])

  const addEntry = () => {
    if (newEntry.trim()) {
      const newEntryObj = {
        id: Date.now(),
        content: newEntry,
        timestamp: new Date().toLocaleString()
      }
      const updatedEntries = [newEntryObj, ...entries]
      setEntries(updatedEntries)
      localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries))
      setNewEntry('')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-red-950 border-red-800 text-red-100">
        <CardHeader>
          <CardTitle className="text-2xl">Scroll of Memories</CardTitle>
          <CardDescription className="text-red-300">Chronicle your dragon's journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Inscribe your thoughts, mighty dragon..."
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="min-h-[100px] bg-red-900/50 border-red-800 text-red-100 placeholder-red-400"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={addEntry} className="bg-red-700 text-red-100 hover:bg-red-600">
            Seal This Memory
          </Button>
        </CardFooter>
      </Card>
      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="bg-red-950 border-red-800 text-red-100">
            <CardHeader>
              <CardTitle className="text-sm text-red-300">{entry.timestamp}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{entry.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}