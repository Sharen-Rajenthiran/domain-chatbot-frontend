"use client"

import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import Chat from '@/components/Chat'
import DocumentsPanel from '@/components/DocumentsPanel'
import { useChatStore } from '@/components/ChatProvider'
import { useState } from 'react'

export default function HomePage() {
  const { activeChatId } = useChatStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#111111]">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <TopNav onMenu={() => setSidebarOpen(true)} />

        <div className="flex flex-1 overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 overflow-hidden">
            <Chat />
          </div>

          {/* Docs panel */}
          <div className="hidden lg:block w-80 border-l border-gray-800 bg-[#1a1a1a]">
            {activeChatId && <DocumentsPanel chatId={activeChatId} />}
          </div>
        </div>
      </div>
    </div>
  )
}
