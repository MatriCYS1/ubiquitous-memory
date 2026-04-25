'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Terminal } from 'lucide-react'

interface Command {
  id: string
  name: string
  description: string
  usage: string
  permission: string
  enabled: boolean
  createdAt: string
  createdBy: {
    id: string
    username: string
  }
}

export default function CommandManagement() {
  const [commands, setCommands] = useState<Command[]>([])
  const [showCreateCommand, setShowCreateCommand] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newCommand, setNewCommand] = useState({
    name: '',
    description: '',
    usage: '',
    permission: 'read_messages',
    enabled: true
  })

  const availablePermissions = [
    'read_messages',
    'send_messages',
    'create_room',
    'manage_rooms',
    'kick_users',
    'ban_users',
    'mute_users',
    'manage_messages',
    'manage_roles',
    'admin_panel'
  ]

  useEffect(() => {
    fetchCommands()
  }, [])

  const fetchCommands = async () => {
    try {
      const response = await fetch('/api/admin/commands')
      if (response.ok) {
        const data = await response.json()
        setCommands(data)
      }
    } catch (error) {
      console.error('Error fetching commands:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCommand = async () => {
    try {
      const response = await fetch('/api/admin/commands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCommand)
      })

      if (response.ok) {
        setNewCommand({
          name: '',
          description: '',
          usage: '',
          permission: 'read_messages',
          enabled: true
        })
        setShowCreateCommand(false)
        fetchCommands()
      }
    } catch (error) {
      console.error('Error creating command:', error)
    }
  }

  const toggleCommand = async (commandId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/commands/${commandId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled })
      })

      if (response.ok) {
        fetchCommands()
      }
    } catch (error) {
      console.error('Error toggling command:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading commands...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Commands</h3>
        <button
          onClick={() => setShowCreateCommand(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Create Command
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Command
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {commands.map((command) => (
              <tr key={command.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Terminal className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        /{command.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {command.usage}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {command.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {command.permission}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleCommand(command.id, !command.enabled)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                      command.enabled ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        command.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateCommand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Command</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Command Name
                </label>
                <input
                  type="text"
                  value={newCommand.name}
                  onChange={(e) => setNewCommand(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="commandname"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usage
                </label>
                <input
                  type="text"
                  value={newCommand.usage}
                  onChange={(e) => setNewCommand(prev => ({ ...prev, usage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/commandname <args>"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newCommand.description}
                  onChange={(e) => setNewCommand(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Permission
                </label>
                <select
                  value={newCommand.permission}
                  onChange={(e) => setNewCommand(prev => ({ ...prev, permission: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availablePermissions.map((permission) => (
                    <option key={permission} value={permission}>
                      {permission}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newCommand.enabled}
                    onChange={(e) => setNewCommand(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={createCommand}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Command
              </button>
              <button
                onClick={() => setShowCreateCommand(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
