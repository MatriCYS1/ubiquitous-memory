'use client'

import { User } from '@/types'

interface UserListProps {
  users: User[]
}

export default function UserList({ users }: UserListProps) {
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
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Online Users ({users.length})
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div key={user.id} className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100">
            <div className="flex items-center flex-1">
              <div className="relative">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 text-sm">
                    {user.username}
                  </span>
                  <div className={`ml-2 w-2 h-2 rounded-full ${getRoleColor(user.role)}`}></div>
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            No users online
          </div>
        )}
      </div>
    </div>
  )
}
