import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { prisma } from './prisma'
import { commandHandler } from './commands'

export const config = {
  api: {
    bodyParser: false
  }
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse & { socket: any }) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    // Store online users
    const onlineUsers = new Map()

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      socket.on('join', async (data) => {
        try {
          const { userId, username } = data
          socket.userId = userId
          socket.username = username

          // Add to online users
          onlineUsers.set(userId, { id: userId, username, socketId: socket.id })

          // Get user with role
          const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true }
          })

          if (user) {
            // Get available rooms
            const rooms = await prisma.room.findMany({
              include: {
                _count: {
                  select: { members: true }
                }
              }
            })

            socket.emit('rooms', rooms.map(room => ({
              ...room,
              memberCount: room._count.members
            })))

            // Broadcast updated online users
            io.emit('onlineUsers', Array.from(onlineUsers.values()))
          }
        } catch (error) {
          console.error('Error in join event:', error)
        }
      })

      socket.on('joinRoom', async (data) => {
        try {
          const { roomId, userId } = data
          
          // Join socket room
          socket.join(roomId)
          socket.currentRoom = roomId

          // Get room messages
          const messages = await prisma.message.findMany({
            where: { roomId },
            include: {
              author: {
                include: { role: true }
              }
            },
            orderBy: { createdAt: 'asc' },
            take: 50
          })

          socket.emit('messages', messages.map(msg => ({
            ...msg,
            author: {
              id: msg.author.id,
              username: msg.author.username,
              role: msg.author.role.name,
              avatar: msg.author.avatar
            }
          })))

          // Add user to room members if not already
          const existingMember = await prisma.roomMember.findUnique({
            where: {
              userId_roomId: { userId, roomId }
            }
          })

          if (!existingMember) {
            await prisma.roomMember.create({
              data: { userId, roomId, role: 'member' }
            })
          }

          // Notify others in room
          socket.to(roomId).emit('userJoined', {
            userId,
            username: socket.username
          })

        } catch (error) {
          console.error('Error in joinRoom event:', error)
        }
      })

      socket.on('sendMessage', async (data) => {
        try {
          const { content, roomId, userId, username } = data

          // Check if it's a command
          const parsed = commandHandler.parseMessage(content)
          
          if (parsed.isCommand && parsed.command) {
            // Handle command
            const user = await prisma.user.findUnique({
              where: { id: userId },
              include: { role: true }
            })

            if (user) {
              const result = await commandHandler.executeCommand(
                parsed.command,
                parsed.args || [],
                {
                  userId,
                  username,
                  roomId,
                  userPermissions: user.role.permissions
                }
              )

              // Create command message
              const commandMessage = await prisma.message.create({
                data: {
                  content: result.message,
                  type: result.type === 'EMBED' ? 'EMBED' : 'COMMAND',
                  roomId,
                  authorId: userId
                },
                include: {
                  author: {
                    include: { role: true }
                  }
                }
              })

              io.to(roomId).emit('newMessage', {
                ...commandMessage,
                author: {
                  id: commandMessage.author.id,
                  username: commandMessage.author.username,
                  role: commandMessage.author.role.name,
                  avatar: commandMessage.author.avatar
                }
              })
            }
          } else {
            // Regular message
            const message = await prisma.message.create({
              data: {
                content,
                type: 'TEXT',
                roomId,
                authorId: userId
              },
              include: {
                author: {
                  include: { role: true }
                }
              }
            })

            io.to(roomId).emit('newMessage', {
              ...message,
              author: {
                id: message.author.id,
                username: message.author.username,
                role: message.author.role.name,
                avatar: message.author.avatar
              }
            })
          }
        } catch (error) {
          console.error('Error in sendMessage event:', error)
        }
      })

      socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId)
        socket.to(roomId).emit('userLeft', {
          userId: socket.userId,
          username: socket.username
        })
      })

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
        
        // Remove from online users
        if (socket.userId) {
          onlineUsers.delete(socket.userId)
          io.emit('onlineUsers', Array.from(onlineUsers.values()))
        }

        // Notify current room
        if (socket.currentRoom) {
          socket.to(socket.currentRoom).emit('userLeft', {
            userId: socket.userId,
            username: socket.username
          })
        }
      })
    })

    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler
