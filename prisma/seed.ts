import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Full server access',
      permissions: [
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
      ],
      color: '#EF4444'
    }
  })

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {},
    create: {
      name: 'moderator',
      description: 'Can moderate users and messages',
      permissions: [
        'read_messages',
        'send_messages',
        'kick_users',
        'mute_users',
        'manage_messages'
      ],
      color: '#F97316'
    }
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Regular user access',
      permissions: [
        'read_messages',
        'send_messages'
      ],
      color: '#3B82F6'
    }
  })

  const guestRole = await prisma.role.upsert({
    where: { name: 'guest' },
    update: {},
    create: {
      name: 'guest',
      description: 'Limited access for unauthenticated users',
      permissions: [
        'read_messages'
      ],
      color: '#6B7280'
    }
  })

  console.log('Roles created:', { adminRole, moderatorRole, userRole, guestRole })

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@chatapp.com' },
    update: {},
    create: {
      email: 'admin@chatapp.com',
      username: 'admin',
      password: hashedPassword,
      roleId: adminRole.id
    }
  })

  console.log('Admin user created:', adminUser)

  // Create default room
  const generalRoom = await prisma.room.upsert({
    where: { name: 'general' },
    update: {},
    create: {
      name: 'general',
      description: 'General discussion room',
      isPrivate: false
    }
  })

  console.log('General room created:', generalRoom)

  // Add admin to general room
  await prisma.roomMember.upsert({
    where: {
      userId_roomId: {
        userId: adminUser.id,
        roomId: generalRoom.id
      }
    },
    update: {},
    create: {
      userId: adminUser.id,
      roomId: generalRoom.id,
      role: 'owner'
    }
  })

  // Create default commands
  const commands = [
    {
      name: 'help',
      description: 'Shows available commands',
      usage: '/help',
      permission: 'read_messages',
      enabled: true
    },
    {
      name: 'kick',
      description: 'Kick a user from room',
      usage: '/kick <username>',
      permission: 'kick_users',
      enabled: true
    },
    {
      name: 'ban',
      description: 'Ban a user from server',
      usage: '/ban <username>',
      permission: 'ban_users',
      enabled: true
    },
    {
      name: 'mute',
      description: 'Mute a user in room',
      usage: '/mute <username> [duration]',
      permission: 'mute_users',
      enabled: true
    },
    {
      name: 'clear',
      description: 'Clear chat messages',
      usage: '/clear [count]',
      permission: 'manage_messages',
      enabled: true
    },
    {
      name: 'role',
      description: 'Manage user roles',
      usage: '/role <username> <role>',
      permission: 'manage_roles',
      enabled: true
    },
    {
      name: 'info',
      description: 'Get information about a user',
      usage: '/info [username]',
      permission: 'read_messages',
      enabled: true
    }
  ]

  for (const command of commands) {
    await prisma.command.upsert({
      where: { name: command.name },
      update: {},
      create: {
        ...command,
        createdById: adminUser.id
      }
    })
  }

  console.log('Commands created')

  console.log('Database seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
