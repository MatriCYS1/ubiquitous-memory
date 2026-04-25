'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (message: string) => void
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={1}
          style={{
            minHeight: '40px',
            maxHeight: '120px',
            overflowY: 'auto'
          }}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  )
}
