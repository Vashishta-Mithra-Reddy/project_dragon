'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, X, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface NutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  potassium: number;
  cholesterol: number;
  vitamins: {
    a: number;
    c: number;
    d: number;
    e: number;
  };
}

interface MealEntry extends NutritionInfo {
  id: number;
  timestamp: string;
  quantity: number;
}

async function fetchNutrition(food: string): Promise<NutritionInfo> {
  const response = await fetch('/api/nutrition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: food }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch nutrition information');
  }

  return await response.json();
}

export default function DietPage() {
  const [entries, setEntries] = useState<MealEntry[]>([])
  const [newFood, setNewFood] = useState('')
  const [quantity, setQuantity] = useState(100)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedEntries = localStorage.getItem('dietEntries')
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [])

  const addEntry = async () => {
    if (newFood.trim() && quantity > 0) {
      setIsLoading(true)
      try {
        const nutritionInfo = await fetchNutrition(newFood)
        const scaleFactor = quantity / 100
        const scaledNutritionInfo = scaleNutritionInfo(nutritionInfo, scaleFactor)
        const newEntry: MealEntry = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          ...scaledNutritionInfo,
          name: capitalizeFirstLetter(nutritionInfo.name),
          quantity: quantity,
        }
        const updatedEntries = [newEntry, ...entries]
        setEntries(updatedEntries)
        localStorage.setItem('dietEntries', JSON.stringify(updatedEntries))
        setNewFood('')
        setQuantity(100)
        toast({
          title: "Meal added",
          description: `${newEntry.name} (${newEntry.calories.toFixed(2)} calories) added to your dragon's feast.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch nutrition information. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const removeEntry = (id: number) => {
    const updatedEntries = entries.filter(entry => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem('dietEntries', JSON.stringify(updatedEntries))
    toast({
      title: "Meal removed",
      description: "The meal has been removed from your dragon's feast.",
    })
  }

  const clearAllEntries = () => {
    setEntries([])
    localStorage.removeItem('dietEntries')
    toast({
      title: "All meals cleared",
      description: "Your dragon's feast has been reset.",
    })
  }

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const scaleNutritionInfo = (info: NutritionInfo, factor: number): NutritionInfo => {
    return {
      ...info,
      calories: info.calories * factor,
      protein: info.protein * factor,
      carbs: info.carbs * factor,
      fat: info.fat * factor,
      fiber: info.fiber * factor,
      sugar: info.sugar * factor,
      sodium: info.sodium * factor,
      potassium: info.potassium * factor,
      cholesterol: info.cholesterol * factor,
      vitamins: {
        a: info.vitamins.a * factor,
        c: info.vitamins.c * factor,
        d: info.vitamins.d * factor,
        e: info.vitamins.e * factor,
      },
    }
  }

  const totalCalories = entries.reduce((sum, entry) => sum + (entry.calories || 0), 0)
  const totalProtein = entries.reduce((sum, entry) => sum + (entry.protein || 0), 0)
  const totalCarbs = entries.reduce((sum, entry) => sum + (entry.carbs || 0), 0)
  const totalFat = entries.reduce((sum, entry) => sum + (entry.fat || 0), 0)
  const totalFiber = entries.reduce((sum, entry) => sum + (entry.fiber || 0), 0)
  const totalSugar = entries.reduce((sum, entry) => sum + (entry.sugar || 0), 0)
  const totalVitaminA = entries.reduce((sum, entry) => sum + (entry.vitamins?.a || 0), 0)
  const totalVitaminC = entries.reduce((sum, entry) => sum + (entry.vitamins?.c || 0), 0)
  const totalVitaminD = entries.reduce((sum, entry) => sum + (entry.vitamins?.d || 0), 0)
  const totalVitaminE = entries.reduce((sum, entry) => sum + (entry.vitamins?.e || 0), 0)

  const formatValue = (value: number | undefined, unit: string = '') => {
    return value !== undefined ? `${value.toFixed(2)}${unit}` : 'N/A'
  }

  return (
    <Card className="bg-red-950 border-red-800 text-red-100">
      <CardHeader>
        <CardTitle className="text-2xl">Dragon's Feast</CardTitle>
        <CardDescription className="text-red-300">Fuel your inner dragon</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <Input
            placeholder="Dragon's meal"
            value={newFood}
            onChange={(e) => setNewFood(e.target.value)}
            className="bg-red-900/50 border-red-800 text-red-100 placeholder-red-400"
          />
          <Input
            type="number"
            placeholder="Quantity (g)"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="bg-red-900/50 border-red-800 text-red-100 placeholder-red-400 w-32"
          />
          <Button onClick={addEntry} className="bg-red-700 text-red-100 hover:bg-red-600" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Consume'}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Card className="bg-red-900/50 border-red-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-red-100">Total Fire Power</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-100">{formatValue(totalCalories)} calories</p>
            </CardContent>
          </Card>
          <Card className="bg-red-900/50 border-red-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-red-100">Total Macronutrients</CardTitle>
            </CardHeader>
            <CardContent className="text-red-100">
              <p>Protein: {formatValue(totalProtein, 'g')}</p>
              <p>Carbs: {formatValue(totalCarbs, 'g')}</p>
              <p>Fat: {formatValue(totalFat, 'g')}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-900/50 border-red-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-red-100">Total Fiber & Sugar</CardTitle>
            </CardHeader>
            <CardContent className="text-red-100">
              <p>Fiber: {formatValue(totalFiber, 'g')}</p>
              <p>Sugar: {formatValue(totalSugar, 'g')}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-900/50 border-red-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-red-100">Total Vitamins</CardTitle>
            </CardHeader>
            <CardContent className="text-red-100">
              <p>Vitamin A: {formatValue(totalVitaminA, 'µg')}</p>
              <p>Vitamin C: {formatValue(totalVitaminC, 'mg')}</p>
              <p>Vitamin D: {formatValue(totalVitaminD, 'µg')}</p>
              <p>Vitamin E: {formatValue(totalVitaminE, 'mg')}</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end mb-4">
          <Button onClick={clearAllEntries} variant="outline" className="text-red-300 border-red-300 hover:bg-red-800">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-red-300">Food</TableHead>
              <TableHead className="text-red-300">Quantity</TableHead>
              <TableHead className="text-red-300">Calories</TableHead>
              <TableHead className="text-red-300">Protein</TableHead>
              <TableHead className="text-red-300">Carbs</TableHead>
              <TableHead className="text-red-300">Fat</TableHead>
              <TableHead className="text-red-300">Details</TableHead>
              <TableHead className="text-red-300">Time</TableHead>
              <TableHead className="text-red-300">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.quantity}g</TableCell>
                <TableCell>{formatValue(entry.calories)}</TableCell>
                <TableCell>{formatValue(entry.protein, 'g')}</TableCell>
                <TableCell>{formatValue(entry.carbs, 'g')}</TableCell>
                <TableCell>{formatValue(entry.fat, 'g')}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-300 border-red-300 hover:bg-red-800">
                        <Info className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-red-950 border-red-800 text-red-100">
                      <DialogHeader>
                        <DialogTitle>Nutrition Details for {entry.name}</DialogTitle>
                        <DialogDescription className="text-red-300">
                          Detailed breakdown of nutritional information for {entry.quantity}g
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p><strong>Fiber:</strong> {formatValue(entry.fiber, 'g')}</p>
                          <p><strong>Sugar:</strong> {formatValue(entry.sugar, 'g')}</p>
                          <p><strong>Sodium:</strong> {formatValue(entry.sodium, 'mg')}</p>
                          <p><strong>Potassium:</strong> {formatValue(entry.potassium, 'mg')}</p>
                          <p><strong>Cholesterol:</strong> {formatValue(entry.cholesterol, 'mg')}</p>
                        </div>
                        <div>
                          <p><strong>Vitamin A:</strong> {formatValue(entry.vitamins?.a, 'µg')}</p>
                          <p><strong>Vitamin C:</strong> {formatValue(entry.vitamins?.c, 'mg')}</p>
                          <p><strong>Vitamin D:</strong> {formatValue(entry.vitamins?.d, 'µg')}</p>
                          <p><strong>Vitamin E:</strong> {formatValue(entry.vitamins?.e, 'mg')}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>{entry.timestamp}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => removeEntry(entry.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-300 hover:bg-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}