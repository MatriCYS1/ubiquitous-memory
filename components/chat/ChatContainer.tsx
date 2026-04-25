'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import RoomList from './RoomList'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import UserList from './UserList'
import { User } from '@/types'

interface ChatContainerProps {
  user: User
}

export default function ChatContainer({ user }: ChatContainerProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    
    socketInstance.on('connect', () => {
      console.log('Connected to server')
      socketInstance.emit('join', { userId: user.id, username: user.username })
    })

    socketInstance.on('rooms', (roomsData: any[]) => {
      setRooms(roomsData)
    })

    socketInstance.on('messages', (messagesData: any[]) => {
      setMessages(messagesData)
    })

    socketInstance.on('newMessage', (message: any) => {
      setMessages(prev => [...prev, message])
    })

    socketInstance.on('onlineUsers', (users: any[]) => {
      setOnlineUsers(users)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [user.id, user.username])

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('joinRoom', { roomId, userId: user.id })
      setCurrentRoom(roomId)
    }
  }

  const sendMessage = (content: string) => {
    if (socket && currentRoom) {
      socket.emit('sendMessage', {
        content,
        roomId: currentRoom,
        userId: user.id,
        username: user.username
      })
    }
  }

  return (
    <div className="flex w-full h-full">
      {/* Room List */}
      <div className="w-64 bg-white border-r border-gray-200">
        <RoomList
          rooms={rooms}
          currentRoom={currentRoom}
          onRoomSelect={joinRoom}
          user={user}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <MessageList messages={messages} currentUser={user} />
        <MessageInput onSendMessage={sendMessage} />
      </div>

      {/* User List */}
      <div className="w-64 bg-white border-l border-gray-200">
        <UserList users={onlineUsers} />
      </div>
    </div>
  )
}
