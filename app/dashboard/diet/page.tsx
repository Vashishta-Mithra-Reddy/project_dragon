'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface MealEntry {
  id: number;
  food: string;
  calories: number;
  timestamp: string;
}

export default function DietPage() {
  const [entries, setEntries] = useState<MealEntry[]>([])
  const [newFood, setNewFood] = useState('')
  const [newCalories, setNewCalories] = useState('')

  useEffect(() => {
    const storedEntries = localStorage.getItem('dietEntries')
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [])

  const addEntry = () => {
    if (newFood.trim() && newCalories.trim()) {
      const newEntry = {
        id: Date.now(),
        food: newFood,
        calories: parseInt(newCalories),
        timestamp: new Date().toLocaleString()
      }
      const updatedEntries = [newEntry, ...entries]
      setEntries(updatedEntries)
      localStorage.setItem('dietEntries', JSON.stringify(updatedEntries))
      setNewFood('')
      setNewCalories('')
    }
  }

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0)

  return (
    <Card className="bg-red-950 border-red-800 text-red-100">
      <CardHeader>
        <CardTitle className="text-2xl">Dragon's Feast</CardTitle>
        <CardDescription className="text-red-300">Fuel your inner dragon</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Dragon's meal"
            value={newFood}
            onChange={(e) => setNewFood(e.target.value)}
            className="bg-red-900/50 border-red-800 text-red-100 placeholder-red-400"
          />
          <Input
            type="number"
            placeholder="Fire power"
            value={newCalories}
            onChange={(e) => setNewCalories(e.target.value)}
            className="bg-red-900/50 border-red-800 text-red-100 placeholder-red-400"
          />
          <Button onClick={addEntry} className="bg-red-700 text-red-100 hover:bg-red-600">
            Consume
          </Button>
        </div>
        <div className="mb-4">
          <strong>Total Fire Power: {totalCalories} calories</strong>
        </div>
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="flex justify-between items-center">
              <span>{entry.food} - {entry.calories} fire power</span>
              <span className="text-sm text-red-300">{entry.timestamp}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}