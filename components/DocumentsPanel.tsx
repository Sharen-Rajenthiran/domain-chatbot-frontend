"use client"

import React, { useEffect, useState } from 'react'

type Doc = { id: string; name: string; type: string }

export default function DocumentsPanel({ chatId }: { chatId: string }) {
  const [docs, setDocs] = useState<Doc[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!chatId) {
      setDocs([])
      setLoading(false)
      return
    }

    const fetchDocs = async () => {
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:8001/api/docs?chatId=${chatId}`)
        
        if (response.ok) {
          const data = await response.json()
          console.log("📄 Documents API Response:", data)
          
          if (data.docs && data.docs.length > 0) {
            console.log("Documents found:", data.docs.map((d: Doc) => d.name))
          } else {
            console.log("No documents in response")
          }
          
          setDocs(data.docs || [])
        } else {
          console.log(`API Request Failed - Status: ${response.status}`)
          const errorText = await response.text()
          console.log("Error Response:", errorText)
          setDocs([])
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error)
        setDocs([])
      } finally {
        setLoading(false)
      }
    }

    fetchDocs()
  }, [chatId])

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      <div className="px-4 py-4 border-b border-gray-800">
        <h3 className="font-semibold text-white">Documents Ingested</h3>
        <div className="text-xs text-gray-400 mt-1">
          Chat: <span className="font-mono text-blue-400">{chatId}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading && <div className="text-sm text-gray-400">Loading...</div>}
        {!loading && (docs?.length ?? 0) === 0 && (
          <div className="text-sm text-gray-400">No documents found for this chat.</div>
        )}
        {docs?.map((d) => (
          <div key={d.id} className="rounded-lg border border-gray-800 p-3 text-sm bg-[#2a2a2a] hover:bg-[#333333] transition-colors">
            <div className="font-medium text-white">{d.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
