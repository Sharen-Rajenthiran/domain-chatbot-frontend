"use client"

import React, { createContext, useContext, useMemo, useState } from 'react'
import { nanoid } from 'nanoid/non-secure'

export type Role = 'user' | 'assistant'
export type Message = { id: string; role: Role; content: string }
export type Chat = { id: string; title: string; messages: Message[] }

function makeInitialChats(): Chat[] {
  const c1: Chat = {
    id: 'chat-1',
    title: 'Welcome',
    messages: [
      { id: nanoid(), role: 'assistant', content: 'Hello! How can I help you today?' },
      { id: nanoid(), role: 'user', content: 'Show me how this UI works.' },
      { id: nanoid(), role: 'assistant', content: 'Use the sidebar to switch chats and the input below to send messages.' },
    ],
  }
  const c2: Chat = {
    id: 'chat-2',
    title: 'Project Ideas',
    messages: [
      { id: nanoid(), role: 'assistant', content: 'Let\'s brainstorm some project ideas.' },
    ],
  }
  return [c1, c2]
}

interface ChatContextValue {
  chats: Chat[]
  activeChatId: string | null
  setActiveChat: (id: string) => void
  newChat: () => void
  deleteChat: (id: string) => void
  appendMessage: (chatId: string, role: Role, content: string) => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(makeInitialChats())
  const [activeChatId, setActiveChatId] = useState<string | null>('chat-1')

  const setActiveChat = (id: string) => setActiveChatId(id)

  const newChat = () => {
    const id = nanoid()
    const chat: Chat = { id, title: 'New Chat', messages: [] }
    setChats((prev) => [chat, ...prev])
    setActiveChatId(id)
  }

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id))
    setActiveChatId((prev) => {
      if (prev === id) {
        const remaining = chats.filter((c) => c.id !== id)
        return remaining.length ? remaining[0].id : null
      }
      return prev
    })
  }

  const appendMessage = (chatId: string, role: Role, content: string) => {
    setChats((prev) => prev.map((c) => (
      c.id === chatId
        ? { ...c, messages: [...c.messages, { id: nanoid(), role, content }] }
        : c
    )))
  }

  const value = useMemo(() => ({
    chats,
    activeChatId,
    setActiveChat,
    newChat,
    deleteChat,
    appendMessage,
  }), [chats, activeChatId])

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatStore() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatStore must be used within ChatProvider')
  return ctx
}
