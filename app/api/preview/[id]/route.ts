import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = `${BACKEND_URL}/api/preview/${params.id}`
    
    const token = request.headers.get('authorization')
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Preview API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
