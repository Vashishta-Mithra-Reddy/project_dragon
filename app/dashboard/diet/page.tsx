'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface MealEntry {
  id: number;
  food: string;
  calories: number;
  timestamp: string;
}

async function fetchCalories(food: string): Promise<number> {
  const response = await fetch('/api/nutrition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: food }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch calorie information');
  }

  const data = await response.json();
  return data.calories;
}

export default function DietPage() {
  const [entries, setEntries] = useState<MealEntry[]>([])
  const [newFood, setNewFood] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedEntries = localStorage.getItem('dietEntries')
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [])

  const addEntry = async () => {
    if (newFood.trim()) {
      setIsLoading(true)
      try {
        const calories = await fetchCalories(newFood)
        const newEntry = {
          id: Date.now(),
          food: newFood,
          calories: calories,
          timestamp: new Date().toLocaleString()
        }
        const updatedEntries = [newEntry, ...entries]
        setEntries(updatedEntries)
        localStorage.setItem('dietEntries', JSON.stringify(updatedEntries))
        setNewFood('')
        toast({
          title: "Meal added",
          description: `${newFood} (${calories} calories) added to your dragon's feast.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch calorie information. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
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
          <Button onClick={addEntry} className="bg-red-700 text-red-100 hover:bg-red-600" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Consume'}
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