"use client"

import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useChatStore } from './ChatProvider'
import ChatInput from './ChatInput'
import clsx from 'clsx'

export default function Chat() {
  const { chats, activeChatId } = useChatStore()
  const activeChat = chats.find((c) => c.id === activeChatId)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // auto scroll to bottom when activeChat changes
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [activeChat?.messages.length, activeChatId])

  return (
    <div className="flex h-full flex-col bg-[#111111]">
      {!activeChat ? (
        // Empty state - centered greeting
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400 mb-2">Hello there!</div>
            <div className="text-lg text-gray-400">How can I help you today?</div>
          </div>
        </div>
      ) : (
        <>
          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {activeChat.messages.map((m) => (
                <MessageBubble key={m.id} role={m.role} content={m.content} />
              ))}
            </div>
          </div>

          {/* Input fixed at bottom */}
          <div className="sticky bottom-0 bg-[#111111] border-t border-gray-800 p-4">
            <div className="max-w-4xl mx-auto">
              <ChatInput chatId={activeChat.id} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function MessageBubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  const isUser = role === 'user'
  return (
    <div className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={clsx(
        'rounded-xl px-4 py-2 max-w-lg prose-message whitespace-pre-wrap',
        isUser 
          ? 'bg-[#2a2a2a] text-white ml-auto' 
          : 'bg-[#1f1f1f] text-gray-200'
      )}>
        {content}
      </div>
    </div>
  )
}
