import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { query } = await req.json()

  const nutritionixAppId = process.env.NUTRITIONIX_APP_ID
  const nutritionixApiKey = process.env.NUTRITIONIX_API_KEY

  if (!nutritionixAppId || !nutritionixApiKey) {
    return NextResponse.json({ error: 'Missing API credentials' }, { status: 500 })
  }

  const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': nutritionixAppId,
      'x-app-key': nutritionixApiKey,
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch nutrition data' }, { status: response.status })
  }

  const data = await response.json()
  const calories = data.foods[0]?.nf_calories || 0

  return NextResponse.json({ calories })
}