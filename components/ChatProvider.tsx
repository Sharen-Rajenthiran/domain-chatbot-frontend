"use client"

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { nanoid } from 'nanoid/non-secure'

export type Role = 'user' | 'assistant'
export type Message = { id: string; role: Role; content: string; timestamp?: string }
export type Chat = { 
  id: string; 
  title: string; 
  messages: Message[];
  messageCount?: number;
  lastActivity?: string;
}

// Note: We now use chatId as userId for simplicity

interface ChatContextValue {
  chats: Chat[]
  activeChatId: string | null
  loading: boolean
  setActiveChat: (id: string) => void
  newChat: () => void
  deleteChat: (id: string) => Promise<void>
  sendMessage: (message: string) => Promise<void>
  loadChatHistory: (chatId: string) => Promise<void>
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Load all chats on component mount
  useEffect(() => {
    loadAllChats()
  }, [])

  const loadAllChats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/chats')
      if (response.ok) {
        const data = await response.json()
        const backendChats = data.chats.map((chat: any) => ({
          id: chat.chatId,
          title: chat.firstMessage || 'New Chat',
          messages: [],
          messageCount: chat.messageCount,
          lastActivity: chat.lastActivity
        }))
        setChats(backendChats)
        
        // Set first chat as active if no active chat
        if (backendChats.length > 0 && !activeChatId) {
          setActiveChatId(backendChats[0].id)
          await loadChatHistory(backendChats[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to load chats:', error)
    }
  }

  const loadChatHistory = async (chatId: string) => {
    try {
      const response = await fetch(`http://localhost:8001/api/chats/${chatId}/messages`)
      if (response.ok) {
        const data = await response.json()
        const messages = data.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role as Role,
          content: msg.content,
          timestamp: msg.timestamp
        }))
        
        setChats(prev => prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, messages }
            : chat
        ))
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }

  const setActiveChat = async (id: string) => {
    setActiveChatId(id)
    // Load messages for this chat if not already loaded
    const chat = chats.find(c => c.id === id)
    if (chat && chat.messages.length === 0) {
      await loadChatHistory(id)
    }
  }

  const newChat = () => {
    // Prompt user for chat name
    const chatName = prompt('Enter a name for your new chat (this will be used as the chat ID):')
    
    if (!chatName || !chatName.trim()) {
      return // User cancelled or entered empty name
    }
    
    // Clean the name to make it a valid ID
    const cleanName = chatName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const chatId = `chat-${cleanName}`
    
    // Check if chat with this ID already exists
    if (chats.some(chat => chat.id === chatId)) {
      alert(`A chat with the name "${cleanName}" already exists. Please choose a different name.`)
      return
    }
    
    const newChatObj: Chat = {
      id: chatId,
      title: chatName.trim(),
      messages: [],
      messageCount: 0,
      lastActivity: new Date().toISOString()
    }
    
    setChats(prev => [newChatObj, ...prev])
    setActiveChatId(chatId)
  }

  const deleteChat = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8001/api/chats/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setChats(prev => prev.filter(c => c.id !== id))
        
        // If deleting active chat, switch to another one
        if (activeChatId === id) {
          const remainingChats = chats.filter(c => c.id !== id)
          if (remainingChats.length > 0) {
            setActiveChatId(remainingChats[0].id)
            await loadChatHistory(remainingChats[0].id)
          } else {
            setActiveChatId(null)
          }
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }

  const sendMessage = async (message: string) => {
    if (!activeChatId || !message.trim()) return

    setLoading(true)
    
    // Add user message immediately to UI
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }
    
    setChats(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ))

    try {
      const response = await fetch('http://localhost:8001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: activeChatId,
          message: message,
          userId: activeChatId // Use same ID for both chatId and userId
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add assistant response to UI
        const assistantMessage: Message = {
          id: data.messageId,
          role: 'assistant',
          content: data.response,
          timestamp: data.timestamp
        }
        
        setChats(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? { 
                ...chat, 
                messages: [...chat.messages, assistantMessage],
                title: chat.title === 'New Chat' ? message.slice(0, 50) + '...' : chat.title
              }
            : chat
        ))
      } else {
        // Remove user message if API call failed
        setChats(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? { ...chat, messages: chat.messages.slice(0, -1) }
            : chat
        ))
        console.error('Failed to send message')
      }
    } catch (error) {
      // Remove user message if API call failed
      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, messages: chat.messages.slice(0, -1) }
          : chat
      ))
      console.error('Failed to send message:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = useMemo(() => ({
    chats,
    activeChatId,
    loading,
    setActiveChat,
    newChat,
    deleteChat,
    sendMessage,
    loadChatHistory,
  }), [chats, activeChatId, loading])

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatStore() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatStore must be used within ChatProvider')
  return ctx
}
