import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        _count: {
          select: { members: true }
        }
      }
    })

    return NextResponse.json(rooms.map(room => ({
      ...room,
      memberCount: room._count.members
    })))
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, description, isPrivate } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      )
    }

    // Check if user has permission to create rooms
    if (!session.user.permissions.includes('create_room')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const room = await prisma.room.create({
      data: {
        name,
        description,
        isPrivate: isPrivate || false
      }
    })

    // Add creator as room owner
    await prisma.roomMember.create({
      data: {
        userId: session.user.id,
        roomId: room.id,
        role: 'owner'
      }
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    )
  }
}
