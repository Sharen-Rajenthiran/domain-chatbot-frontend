import type { Metadata } from 'next'
import './globals.css'
import { ChatProvider } from '@/components/ChatProvider'

export const metadata: Metadata = {
  title: 'ChatGPT-like UI',
  description: 'Chat UI with sidebar, chat history, docs panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="h-full bg-[#111111] text-white">
        <ChatProvider>
          {children}
        </ChatProvider>
      </body>
    </html>
  )
}
