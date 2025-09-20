"use client"

import React, { useEffect, useState } from 'react'

type Doc = { id: string; name: string; type: string }

export default function DocumentsPanel({ chatId }: { chatId: string }) {
  const [docs, setDocs] = useState<Doc[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/docs?chatId=${encodeURIComponent(chatId)}`)
        const data = await res.json()
        if (!cancelled) setDocs(data.docs || [])
      } catch (e) {
        if (!cancelled) setDocs([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [chatId])

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      <div className="px-4 py-4 border-b border-gray-800">
        <h3 className="font-semibold text-white">Documents Ingested</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading && <div className="text-sm text-gray-400">Loading...</div>}
        {!loading && (docs?.length ?? 0) === 0 && (
          <div className="text-sm text-gray-400">No documents found for this chat.</div>
        )}
        {docs?.map((d) => (
          <div key={d.id} className="rounded-lg border border-gray-800 p-3 text-sm bg-[#2a2a2a] hover:bg-[#333333] transition-colors">
            <div className="font-medium text-white mb-1">{d.name}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">{d.type}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
