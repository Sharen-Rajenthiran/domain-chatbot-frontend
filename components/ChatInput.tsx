"use client"

import React, { useState } from 'react'
import { useChatStore } from './ChatProvider'

export default function ChatInput({ chatId }: { chatId: string }) {
  const { appendMessage } = useChatStore()
  const [value, setValue] = useState('')
  const [sending, setSending] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = value.trim()
    if (!text) return
    setSending(true)
    appendMessage(chatId, 'user', text)
    setValue('')
    // mock assistant reply
    setTimeout(() => {
      appendMessage(chatId, 'assistant', 'This is a mocked assistant response.')
      setSending(false)
    }, 400)
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="flex items-end gap-2">
        <input
          type="text"
          className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 border border-gray-800"
          placeholder="Your message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSubmit(e)
            }
          }}
        />
        <button
          type="submit"
          disabled={sending || value.trim().length === 0}
          className="p-2 rounded-lg bg-white text-black disabled:opacity-50 disabled:bg-gray-600 hover:bg-gray-200 transition-colors hover:shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </form>
  )
}
