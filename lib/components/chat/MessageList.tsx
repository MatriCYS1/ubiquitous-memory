'use client'

import { useEffect, useRef } from 'react'
import { User, Message } from '@/types'

interface MessageListProps {
  messages: Message[]
  currentUser: User
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: 'bg-red-500',
      moderator: 'bg-orange-500',
      user: 'bg-blue-500',
      guest: 'bg-gray-500'
    }
    return colors[role] || 'bg-gray-500'
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.author.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.author.id === currentUser.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            {message.type === 'SYSTEM' && (
              <div className="text-center text-sm text-gray-500 italic">
                {message.content}
              </div>
            )}
            
            {message.type === 'TEXT' && (
              <>
                <div className="flex items-center mb-1">
                  <div className={`w-2 h-2 rounded-full ${getRoleColor(message.author.role)} mr-2`} />
                  <span className="font-medium text-sm">
                    {message.author.username}
                  </span>
                  <span className="text-xs opacity-70 ml-2">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                <div className="break-words">{message.content}</div>
              </>
            )}

            {message.type === 'COMMAND' && (
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-2 rounded">
                <div className="font-mono text-sm">{message.content}</div>
              </div>
            )}

            {message.type === 'EMBED' && (
              <div className="bg-purple-100 border border-purple-300 text-purple-800 p-3 rounded">
                <div className="font-medium mb-1">Embed</div>
                <div className="text-sm">{message.content}</div>
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
