import { NextRequest } from 'next/server'
import { NextApiResponse } from 'next'
import SocketHandler from '@/lib/socket'

const handler = (req: NextRequest, res: any) => {
  return SocketHandler(req as any, res as any)
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler
