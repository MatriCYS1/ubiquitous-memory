import { prisma } from './prisma'

export interface CommandContext {
  userId: string
  username: string
  roomId: string
  userPermissions: string[]
}

export interface CommandResult {
  success: boolean
  message: string
  type?: 'TEXT' | 'SYSTEM' | 'COMMAND' | 'EMBED'
}

export class CommandHandler {
  private commands = new Map()

  constructor() {
    this.registerDefaultCommands()
  }

  private registerDefaultCommands() {
    // Help command
    this.register('help', {
      description: 'Shows available commands',
      usage: '/help',
      permission: 'read_messages',
      handler: async (ctx: CommandContext) => {
        const commands = await this.getAvailableCommands(ctx.userPermissions)
        const commandList = commands.map(cmd => `**${cmd.usage}** - ${cmd.description}`).join('\n')
        return {
          success: true,
          message: `Available commands:\n${commandList}`,
          type: 'EMBED'
        }
      }
    })

    // Kick command
    this.register('kick', {
      description: 'Kick a user from the room',
      usage: '/kick <username>',
      permission: 'kick_users',
      handler: async (ctx: CommandContext, args: string[]) => {
        if (args.length === 0) {
          return { success: false, message: 'Usage: /kick <username>' }
        }

        const targetUsername = args[0]
        // Implementation would go here to actually kick the user
        return {
          success: true,
          message: `User ${targetUsername} has been kicked from the room.`,
          type: 'SYSTEM'
        }
      }
    })

    // Ban command
    this.register('ban', {
      description: 'Ban a user from the server',
      usage: '/ban <username>',
      permission: 'ban_users',
      handler: async (ctx: CommandContext, args: string[]) => {
        if (args.length === 0) {
          return { success: false, message: 'Usage: /ban <username>' }
        }

        const targetUsername = args[0]
        // Implementation would go here to actually ban the user
        return {
          success: true,
          message: `User ${targetUsername} has been banned from the server.`,
          type: 'SYSTEM'
        }
      }
    })

    // Mute command
    this.register('mute', {
      description: 'Mute a user in the room',
      usage: '/mute <username> [duration]',
      permission: 'mute_users',
      handler: async (ctx: CommandContext, args: string[]) => {
        if (args.length === 0) {
          return { success: false, message: 'Usage: /mute <username> [duration]' }
        }

        const targetUsername = args[0]
        const duration = args[1] || '10m'
        // Implementation would go here to actually mute the user
        return {
          success: true,
          message: `User ${targetUsername} has been muted for ${duration}.`,
          type: 'SYSTEM'
        }
      }
    })

    // Clear command
    this.register('clear', {
      description: 'Clear chat messages',
      usage: '/clear [count]',
      permission: 'manage_messages',
      handler: async (ctx: CommandContext, args: string[]) => {
        const count = args[0] ? parseInt(args[0]) : 100
        // Implementation would go here to actually clear messages
        return {
          success: true,
          message: `Last ${count} messages have been cleared.`,
          type: 'SYSTEM'
        }
      }
    })

    // Role command
    this.register('role', {
      description: 'Manage user roles',
      usage: '/role <username> <role>',
      permission: 'manage_roles',
      handler: async (ctx: CommandContext, args: string[]) => {
        if (args.length < 2) {
          return { success: false, message: 'Usage: /role <username> <role>' }
        }

        const [targetUsername, roleName] = args
        // Implementation would go here to actually change the role
        return {
          success: true,
          message: `User ${targetUsername}'s role has been changed to ${roleName}.`,
          type: 'SYSTEM'
        }
      }
    })

    // Info command
    this.register('info', {
      description: 'Get information about a user',
      usage: '/info [username]',
      permission: 'read_messages',
      handler: async (ctx: CommandContext, args: string[]) => {
        const username = args[0] || ctx.username
        
        // Get user info from database
        const user = await prisma.user.findUnique({
          where: { username },
          include: { role: true }
        })

        if (!user) {
          return { success: false, message: `User ${username} not found.` }
        }

        const memberSince = new Date(user.createdAt).toLocaleDateString()
        const lastSeen = new Date(user.updatedAt).toLocaleDateString()

        return {
          success: true,
          message: `**User Information for ${user.username}**\n` +
                  `Role: ${user.role.name}\n` +
                  `Permissions: ${user.role.permissions.join(', ')}\n` +
                  `Member Since: ${memberSince}\n` +
                  `Last Seen: ${lastSeen}`,
          type: 'EMBED'
        }
      }
    })
  }

  register(name: string, command: any) {
    this.commands.set(name, command)
  }

  async executeCommand(commandName: string, args: string[], context: CommandContext): Promise<CommandResult> {
    const command = this.commands.get(commandName)
    
    if (!command) {
      return { success: false, message: `Unknown command: ${commandName}` }
    }

    // Check permissions
    if (!context.userPermissions.includes(command.permission)) {
      return { success: false, message: `You don't have permission to use this command.` }
    }

    try {
      return await command.handler(context, args)
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error)
      return { success: false, message: 'An error occurred while executing this command.' }
    }
  }

  async getAvailableCommands(userPermissions: string[]) {
    const availableCommands = []
    
    for (const [name, command] of this.commands) {
      if (userPermissions.includes(command.permission)) {
        availableCommands.push({
          name,
          description: command.description,
          usage: command.usage
        })
      }
    }

    return availableCommands
  }

  parseMessage(message: string): { isCommand: boolean; command?: string; args?: string[] } {
    if (!message.startsWith('/')) {
      return { isCommand: false }
    }

    const parts = message.slice(1).trim().split(' ')
    const command = parts[0]?.toLowerCase()
    const args = parts.slice(1)

    return { isCommand: true, command, args }
  }
}

export const commandHandler = new CommandHandler()
