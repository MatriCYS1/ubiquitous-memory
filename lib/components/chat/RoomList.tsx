'use client'

import { useState } from 'react'
import { Plus, Users, Lock } from 'lucide-react'
import { User, Room } from '@/types'

interface RoomListProps {
  rooms: Room[]
  currentRoom: string | null
  onRoomSelect: (roomId: string) => void
  user: User
}

export default function RoomList({ rooms, currentRoom, onRoomSelect, user }: RoomListProps) {
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [roomDescription, setRoomDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  const canCreateRoom = user.permissions.includes('create_room')

  const createRoom = async () => {
    if (!roomName.trim()) return

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: roomName,
          description: roomDescription,
          isPrivate
        })
      })

      if (response.ok) {
        setRoomName('')
        setRoomDescription('')
        setIsPrivate(false)
        setShowCreateRoom(false)
        // Refresh rooms list would happen here
      }
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Rooms</h2>
          {canCreateRoom && (
            <button
              onClick={() => setShowCreateRoom(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
              currentRoom === room.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex items-center flex-1">
              {room.isPrivate ? (
                <Lock className="w-4 h-4 text-gray-400 mr-2" />
              ) : (
                <Users className="w-4 h-4 text-gray-400 mr-2" />
              )}
              <div>
                <div className="font-medium text-gray-900">{room.name}</div>
                {room.description && (
                  <div className="text-sm text-gray-500">{room.description}</div>
                )}
              </div>
            </div>
            {room.memberCount && (
              <div className="text-sm text-gray-400">{room.memberCount}</div>
            )}
          </div>
        ))}
      </div>

      {showCreateRoom && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-3">Create Room</h3>
          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <textarea
            placeholder="Description (optional)"
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            rows={2}
          />
          <label className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Private room</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={createRoom}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateRoom(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
