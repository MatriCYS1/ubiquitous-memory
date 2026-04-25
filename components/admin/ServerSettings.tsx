'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw } from 'lucide-react'

interface ServerSettings {
  serverName: string
  maxUsers: number
  welcomeMessage: string
  allowRegistration: boolean
  defaultRole: string
  maintenanceMode: boolean
}

export default function ServerSettings() {
  const [settings, setSettings] = useState<ServerSettings>({
    serverName: '',
    maxUsers: 100,
    welcomeMessage: '',
    allowRegistration: true,
    defaultRole: 'user',
    maintenanceMode: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading settings...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Server Settings</h3>
        <div className="flex space-x-2">
          <button
            onClick={fetchSettings}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Server Name
            </label>
            <input
              type="text"
              value={settings.serverName}
              onChange={(e) => setSettings(prev => ({ ...prev, serverName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Users
            </label>
            <input
              type="number"
              value={settings.maxUsers}
              onChange={(e) => setSettings(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Welcome Message
          </label>
          <textarea
            value={settings.welcomeMessage}
            onChange={(e) => setSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Message shown to new users when they join..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Role
            </label>
            <select
              value={settings.defaultRole}
              onChange={(e) => setSettings(prev => ({ ...prev, defaultRole: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="guest">Guest</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings(prev => ({ ...prev, allowRegistration: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Allow User Registration</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Maintenance Mode</span>
            </label>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Warning</h4>
          <p className="text-sm text-yellow-700">
            Changing these settings will affect all users on the server. Please be careful when modifying server configuration.
          </p>
        </div>
      </div>
    </div>
  )
}
