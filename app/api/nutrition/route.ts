import { NextResponse } from 'next/server'

const API_KEY = process.env.NUTRITIONIX_API_KEY
const APP_ID = process.env.NUTRITIONIX_APP_ID

export async function POST(req: Request) {
  const { query } = await req.json()

  const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': APP_ID!,
      'x-app-key': API_KEY!,
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch nutrition data' }, { status: response.status })
  }

  const data = await response.json()
  const food = data.foods[0]

  return NextResponse.json({
    name: food.food_name,
    calories: food.nf_calories,
    protein: food.nf_protein,
    carbs: food.nf_total_carbohydrate,
    fat: food.nf_total_fat,
    fiber: food.nf_dietary_fiber,
    sugar: food.nf_sugars,
    sodium: food.nf_sodium,
    potassium: food.nf_potassium,
    cholesterol: food.nf_cholesterol,
    vitamins: {
      a: food.full_nutrients.find((n: any) => n.attr_id === 320)?.value || 0,
      c: food.full_nutrients.find((n: any) => n.attr_id === 401)?.value || 0,
      d: food.full_nutrients.find((n: any) => n.attr_id === 328)?.value || 0,
      e: food.full_nutrients.find((n: any) => n.attr_id === 323)?.value || 0,
    },
  })
}