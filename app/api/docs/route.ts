import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const chatId = searchParams.get('chatId') || 'unknown'

  // Mocked documents per chat id
  const mock: Record<string, { id: string; name: string; type: string }[]> = {
    'chat-1': [
      { id: 'd1', name: 'Getting Started.pdf', type: 'pdf' },
      { id: 'd2', name: 'User Guide.md', type: 'markdown' },
    ],
    'chat-2': [
      { id: 'd3', name: 'Ideas.txt', type: 'text' },
    ],
  }

  const docs = mock[chatId] ?? []

  return new Response(JSON.stringify({ docs }), {
    headers: { 'content-type': 'application/json' },
  })
}
