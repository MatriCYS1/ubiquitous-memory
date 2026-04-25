'use client'

import { useState, useEffect } from 'react'
import { Users, Settings, Shield, MessageSquare } from 'lucide-react'
import UserManagement from './UserManagement'
import RoleManagement from './RoleManagement'
import ServerSettings from './ServerSettings'
import CommandManagement from './CommandManagement'

type TabType = 'users' | 'roles' | 'settings' | 'commands'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('users')

  const tabs = [
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'roles' as TabType, label: 'Roles', icon: Shield },
    { id: 'commands' as TabType, label: 'Commands', icon: MessageSquare },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings }
  ]

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        
        <nav className="mt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
                  activeTab === tab.id ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 capitalize">
              {activeTab} Management
            </h2>
            <p className="text-gray-600 mt-2">
              Manage server {activeTab} and settings
            </p>
          </div>

          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'roles' && <RoleManagement />}
          {activeTab === 'commands' && <CommandManagement />}
          {activeTab === 'settings' && <ServerSettings />}
        </div>
      </div>
    </div>
  )
}
