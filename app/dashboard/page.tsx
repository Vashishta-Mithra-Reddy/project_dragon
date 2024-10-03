'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { format, isFuture, startOfToday } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Flame, Lock, Unlock, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DiaryEntry {
  id: number;
  content: string;
  timestamp: string;
  date: string;
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [newEntry, setNewEntry] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isLocked, setIsLocked] = useState(false)
  const [showFutureAlert, setShowFutureAlert] = useState(false)

  useEffect(() => {
    const storedEntries = localStorage.getItem('diaryEntries')
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [])

  const addEntry = () => {
    if (newEntry.trim() && selectedDate && !isFuture(selectedDate)) {
      const newEntryObj = {
        id: Date.now(),
        content: newEntry,
        timestamp: new Date().toLocaleString(),
        date: format(selectedDate, 'yyyy-MM-dd')
      }
      const updatedEntries = [newEntryObj, ...entries]
      setEntries(updatedEntries)
      localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries))
      setNewEntry('')
    }
  }

  const sortedDates = Array.from(new Set(entries.map(entry => entry.date))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const filteredEntries = entries.filter(entry => entry.date === format(selectedDate || new Date(), 'yyyy-MM-dd'))

  const toggleLock = () => {
    setIsLocked(!isLocked)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isFuture(date)) {
      setShowFutureAlert(true)
      setTimeout(() => setShowFutureAlert(false), 3000)
    } else {
      setSelectedDate(date)
      setShowFutureAlert(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-red-950 border-red-800 text-red-100">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Scroll of Memories</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleLock}>
              {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </Button>
          </div>
          <CardDescription className="text-red-300">Chronicle your dragon's journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="write" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent h-12">
              <TabsTrigger value="write" className="bg-red-900/50 data-[state=active]:bg-red-800 data-[state=active]:text-red-100 text-red-300 h-9 font-medium mr-2 text-sm">Write</TabsTrigger>
              <TabsTrigger value="calendar" className="bg-red-900/50 data-[state=active]:bg-red-800 data-[state=active]:text-red-100 text-red-300 h-9 font-medium text-sm">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <Textarea
                placeholder="Inscribe your thoughts, mighty dragon..."
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="min-h-[100px] bg-red-900/50 border-red-800 text-red-100 placeholder-red-400 mb-4"
                disabled={isLocked}
              />
              <div className="flex justify-end">
                <Button onClick={addEntry} className="bg-red-700 text-red-100 hover:bg-red-600" disabled={isLocked}>
                  <Flame className="mr-2 h-4 w-4" />
                  Seal This Memory
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="calendar" className="flex justify-center">
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => isFuture(date)}
                  className="rounded-md border border-red-800 bg-red-900/50"
                />
                {showFutureAlert && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      You cannot select future dates.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-red-950 border-red-800 text-red-100">
          <CardHeader>
            <CardTitle className="text-xl">Past Scrolls</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {sortedDates.map((date) => (
                <Button
                  key={date}
                  variant="ghost"
                  className="w-full justify-start text-left font-normal text-red-100 hover:bg-red-900/50"
                  onClick={() => setSelectedDate(new Date(date))}
                >
                  {format(new Date(date), 'MMMM d, yyyy')}
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="bg-red-950 border-red-800 text-red-100">
          <CardHeader>
            <CardTitle className="text-xl">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Today\'s Entries'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <div key={entry.id} className="mb-4 p-4 bg-red-900/30 rounded-md">
                    <p className="text-sm text-red-300 mb-2">{entry.timestamp}</p>
                    <p>{entry.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-red-300">No entries for this date.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}