'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    if (!session.user.permissions.includes('admin_panel')) {
      router.push('/chat')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session || !session.user.permissions.includes('admin_panel')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboard />
    </div>
  )
}
