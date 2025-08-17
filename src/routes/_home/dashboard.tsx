import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGrpcContext } from '@/lib/context/grpc-context'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_home/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const [message, setMessage] = useState('')
  const [connected, setConnected] = useState(false)
  const { startStream, getIsConnected } = useGrpcContext()

  useEffect(() => {
    const fetchConnected = async () => {
      const connected = await getIsConnected()
      setConnected(connected)
    }
    fetchConnected()
  }, [])

  const handleConnect = async () => {
    startStream()
  }

  return (
    <div className="flex flex-col w-full h-full">
      <Button onClick={handleConnect}>Connect</Button>
      <div className='flex flex-row gap-4 mt-4'>
        <div className='flex flex-col gap-2 w-full'>
          <Input onChange={(e) => setMessage(e.target.value)}></Input>
          <Button>Send</Button>
        </div>
        <div className='w-full h-full bg-accent rounded-lg p-4'>
          {/* {
            connected ? ( */}
              <MessageList />
            {/* ) : (
              <div className='flex flex-col gap-2'>
                <p>Not connected</p>
              </div>
            )
          } */}
        </div>
      </div>
    </div>
  )
}

function MessageList() {

  const { streamMessages } = useGrpcContext()

  // const clipboardMessages = useMemo(() => streamMessages.filter((message) => message.type === ''), [streamMessages])

  return (
    <div className='flex flex-col gap-2'>
      {
        streamMessages.map((message) => (
          <MessageItem key={message.id} message={(message.payload)} />
        ))
      }
    </div>
  )
}

function MessageItem({ message }: { message: any }) {
  return (
    <div className='flex flex-row gap-2'>
      <div className='w-10 h-10 bg-accent rounded-full'>{message.content}</div>
    </div>
  )
}
