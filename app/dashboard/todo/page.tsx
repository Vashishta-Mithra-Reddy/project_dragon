'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, Scroll, Swords, Trophy, ChevronDown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuestItem {
  id: number;
  text: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'combat' | 'exploration' | 'wisdom';
}

const CATEGORIES = {
  combat: { icon: Swords, color: 'text-red-400' },
  exploration: { icon: Scroll, color: 'text-yellow-400' },
  wisdom: { icon: Flame, color: 'text-blue-400' }
}

export default function QuestLogPage() {
  const [quests, setQuests] = useState<QuestItem[]>([])
  const [newQuest, setNewQuest] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [selectedCategory, setSelectedCategory] = useState<'combat' | 'exploration' | 'wisdom'>('combat')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

  useEffect(() => {
    const storedQuests = localStorage.getItem('quests')
    if (storedQuests) {
      setQuests(JSON.parse(storedQuests))
    }
  }, [])

  const addQuest = () => {
    if (newQuest.trim()) {
      const newQuestItem: QuestItem = {
        id: Date.now(),
        text: newQuest,
        completed: false,
        difficulty: selectedDifficulty,
        category: selectedCategory
      }
      const updatedQuests = [newQuestItem, ...quests]
      setQuests(updatedQuests)
      localStorage.setItem('quests', JSON.stringify(updatedQuests))
      setNewQuest('')
    }
  }

  const toggleQuest = (id: number) => {
    const updatedQuests = quests.map(quest =>
      quest.id === id ? { ...quest, completed: !quest.completed } : quest
    )
    setQuests(updatedQuests)
    localStorage.setItem('quests', JSON.stringify(updatedQuests))
  }

  const deleteQuest = (id: number) => {
    const updatedQuests = quests.filter(quest => quest.id !== id)
    setQuests(updatedQuests)
    localStorage.setItem('quests', JSON.stringify(updatedQuests))
  }

  const filteredQuests = quests.filter(quest => {
    if (filter === 'active') return !quest.completed
    if (filter === 'completed') return quest.completed
    return true
  })

  const completionRate = Math.round((quests.filter(q => q.completed).length / quests.length) * 100) || 0

  return (
    <Card className="bg-red-950 border-red-800 text-red-100">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Dragon's Quest Log</CardTitle>
          <Trophy className="h-6 w-6 text-yellow-400" />
        </div>
        <CardDescription className="text-red-300">Chart your path to dragon mastery</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 mb-4">
          <Input
            placeholder="Scribe a new quest"
            value={newQuest}
            onChange={(e) => setNewQuest(e.target.value)}
            className="bg-red-900/50 border-red-800 text-red-100 placeholder-red-400"
          />
          <div className="flex space-x-2">
            <Select value={selectedCategory} onValueChange={(value: 'combat' | 'exploration' | 'wisdom') => setSelectedCategory(value)}>
              <SelectTrigger className="w-[180px] bg-red-900/50 border-red-800 text-red-100">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-red-950 border-red-800 text-red-100">
                <SelectItem value="combat">Combat</SelectItem>
                <SelectItem value="exploration">Exploration</SelectItem>
                <SelectItem value="wisdom">Wisdom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setSelectedDifficulty(value)}>
              <SelectTrigger className="w-[180px] bg-red-900/50 border-red-800 text-red-100">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-red-950 border-red-800 text-red-100">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addQuest} className="bg-red-700 text-red-100 hover:bg-red-600 flex-grow">
              Embark on Quest
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span>Quest Completion</span>
            <span>{completionRate}%</span>
          </div>
          <div className="h-2 bg-red-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-300 ease-in-out" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-transparent h-12">
            <TabsTrigger 
              value="all" 
              onClick={() => setFilter('all')} 
              className="bg-red-900/50 data-[state=active]:bg-red-800 data-[state=active]:text-red-100 text-red-300 h-9 font-medium mr-2 text-sm"
            >
              All Quests
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              onClick={() => setFilter('active')} 
              className="bg-red-900/50 data-[state=active]:bg-red-800 data-[state=active]:text-red-100 text-red-300 h-9 font-medium mr-2 text-sm"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              onClick={() => setFilter('completed')} 
              className="bg-red-900/50 data-[state=active]:bg-red-800 data-[state=active]:text-red-100 text-red-300 h-9 font-medium text-sm"
            >
              Completed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <QuestList quests={filteredQuests} toggleQuest={toggleQuest} deleteQuest={deleteQuest} />
          </TabsContent>
          <TabsContent value="active">
            <QuestList quests={filteredQuests} toggleQuest={toggleQuest} deleteQuest={deleteQuest} />
          </TabsContent>
          <TabsContent value="completed">
            <QuestList quests={filteredQuests} toggleQuest={toggleQuest} deleteQuest={deleteQuest} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function QuestList({ quests, toggleQuest, deleteQuest }: { 
  quests: QuestItem[], 
  toggleQuest: (id: number) => void, 
  deleteQuest: (id: number) => void 
}) {
  return (
    <ScrollArea className="h-[300px] pr-4">
      <ul className="space-y-2">
        {quests.map((quest) => {
          const CategoryIcon = CATEGORIES[quest.category].icon
          return (
            <li key={quest.id} className="flex items-center space-x-2 bg-red-900/30 p-2 rounded-md">
              <Checkbox
                id={`quest-${quest.id}`}
                checked={quest.completed}
                onCheckedChange={() => toggleQuest(quest.id)}
                className="border-red-500 data-[state=checked]:bg-red-700 data-[state=checked]:border-red-700"
              />
              <label
                htmlFor={`quest-${quest.id}`}
                className={`flex-grow ${quest.completed ? 'line-through text-red-400' : ''}`}
              >
                {quest.text}
              </label>
              <CategoryIcon className={`h-4 w-4 ${CATEGORIES[quest.category].color}`} />
              <Badge variant="outline" className="text-xs">
                {quest.difficulty}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteQuest(quest.id)}
                className="text-red-300 hover:text-red-100 hover:bg-red-800"
              >
                &times;
              </Button>
            </li>
          )
        })}
      </ul>
    </ScrollArea>
  )
}