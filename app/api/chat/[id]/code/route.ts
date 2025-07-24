import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = `${BACKEND_URL}/api/chat/${params.id}/code`
    
    const token = request.headers.get('authorization')
    const body = await request.json()
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Chat Code Update API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
