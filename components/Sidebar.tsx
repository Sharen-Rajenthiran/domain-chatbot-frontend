"use client"

import React, { useMemo, useState } from 'react'
import { useChatStore } from './ChatProvider'
import clsx from 'clsx'

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { chats, activeChatId, setActiveChat, newChat, deleteChat } = useChatStore()
  const [menuChatId, setMenuChatId] = useState<string | null>(null)

  const containerCls = clsx(
    'fixed z-40 inset-y-0 left-0 w-64 bg-[#1a1a1a] p-4 flex flex-col border-r border-gray-800',
    'lg:static lg:translate-x-0 lg:w-72',
    open ? 'translate-x-0' : '-translate-x-full',
    'transition-transform duration-200 ease-in-out'
  )

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
          aria-hidden
        />
      )}
      
      <div className={containerCls}>
        <div className="flex flex-col h-full">
          <button
            onClick={newChat}
            className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-gray-800 px-4 py-3 text-sm text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {chats.map((c) => (
              <ChatListItem
                key={c.id}
                title={c.title}
                active={c.id === activeChatId}
                onClick={() => setActiveChat(c.id)}
                onDelete={() => deleteChat(c.id)}
                onContextMenu={() => setMenuChatId(c.id)}
                showDelete={menuChatId === c.id}
                onHideMenu={() => setMenuChatId(null)}
              />
            ))}
            {chats.length === 0 && (
              <div className="text-sm text-gray-400 px-4 py-2">No chats yet. Click "New chat" to start.</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function ChatListItem({
  title,
  active,
  onClick,
  onDelete,
  onContextMenu,
  showDelete,
  onHideMenu,
}: {
  title: string
  active: boolean
  onClick: () => void
  onDelete: () => void
  onContextMenu: () => void
  showDelete: boolean
  onHideMenu: () => void
}) {
  return (
    <div className="relative group/item">
      <div className="flex items-center">
        <button
          onClick={onClick}
          className={clsx(
            'flex-1 text-left px-4 py-3 rounded-lg text-sm transition-colors',
            active ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
          )}
        >
          <span className="truncate font-medium">{title}</span>
        </button>
        
        {/* Three dots menu button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onContextMenu()
          }}
          className={clsx(
            'p-2 rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-[#333333]',
            showDelete && 'opacity-100'
          )}
        >
          <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
      
      {/* Delete menu - positioned to not interfere with hover */}
      {showDelete && (
        <div className="absolute right-0 top-full mt-1 z-50">
          <div 
            className="bg-[#2a2a2a] border border-gray-700 rounded-md shadow-lg py-1 min-w-[120px]"
            onMouseLeave={onHideMenu}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#333333] hover:text-red-300 transition-colors"
            >
              Delete chat
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
