"use client"

import React from 'react'

export default function TopNav({ onMenu }: { onMenu: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 h-14 border-b border-gray-800 bg-[#111111]">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 rounded-md hover:bg-[#2a2a2a] text-white"
          aria-label="Open sidebar"
          onClick={onMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6.75a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6.75a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="font-semibold text-lg text-white">Chat</div>
      </div>
      <button
        disabled
        className="bg-gray-700 text-gray-400 cursor-not-allowed rounded px-3 py-1 text-sm font-medium"
      >
        Login
      </button>
    </div>
  )
}
