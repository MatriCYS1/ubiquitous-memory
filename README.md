# Chat Application

A modern, real-time chat application built with Next.js, TypeScript, and Socket.IO. Features role-based access control, command system, and comprehensive admin dashboard.

## Features

- **Real-time Messaging**: Instant chat with Socket.IO
- **Role-based Access Control**: Granular permissions system
- **Command System**: Extensible chat commands with permissions
- **Admin Dashboard**: Complete user and server management
- **Room Management**: Create and manage chat rooms
- **User Authentication**: Secure login with NextAuth
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Socket.IO
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/chat_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Seed the database with default roles and commands:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat interface
│   └── admin/             # Admin dashboard
├── components/            # React components
│   ├── admin/             # Admin components
│   └── chat/              # Chat components
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── commands.ts        # Command system
│   ├── socket.ts         # Socket.IO setup
│   └── prisma.ts        # Prisma client
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Default Roles and Permissions

### Guest
- `read_messages`

### User  
- `read_messages`
- `send_messages`

### Moderator
- All User permissions
- `kick_users`
- `mute_users`
- `manage_messages`

### Admin
- All Moderator permissions
- `create_room`
- `manage_rooms`
- `ban_users`
- `manage_roles`
- `admin_panel`

## Commands

The application includes several built-in commands:

- `/help` - Shows available commands
- `/kick <username>` - Kick a user from room
- `/ban <username>` - Ban a user from server
- `/mute <username> [duration]` - Mute a user
- `/clear [count]` - Clear chat messages
- `/role <username> <role>` - Change user role
- `/info [username]` - Get user information

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` 
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_SOCKET_URL`
4. Deploy

The application is configured for Vercel deployment with `vercel.json`.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Base URL for NextAuth | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth JWT | Yes |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `GITHUB_ID` | GitHub OAuth client ID | Optional |
| `GITHUB_SECRET` | GitHub OAuth client secret | Optional |

## API Routes

- `/api/auth/[...nextauth]` - NextAuth authentication
- `/api/auth/register` - User registration
- `/api/rooms` - Room management
- `/api/admin/users` - User management (admin only)
- `/api/admin/roles` - Role management (admin only)
- `/api/admin/commands` - Command management (admin only)
- `/api/admin/settings` - Server settings (admin only)
- `/api/socket/io` - Socket.IO connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
