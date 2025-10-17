import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGrpcContext } from '@/lib/context/grpc-context'
import { ClipboardMessage, ConnectedDevices, GenericTextMessage, MessageType, ServerMessage } from '@/lib/interfaces/syncer'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_home/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const [message, setMessage] = useState('')
  const [reachable, setReachable] = useState(false)
  
  const { startStream, getIsReachable } = useGrpcContext()

  useEffect(() => {
    const fetchReachable = async () => {
      const isReachable = await getIsReachable()
      setReachable(isReachable)
    }
    fetchReachable()
  }, [getIsReachable])

  const handleConnect = async () => {
    startStream()
  }

  return (
    <div className="flex flex-col w-full h-full">
      <Button onClick={handleConnect}>Connect</Button>
      <div className='flex flex-row gap-4 mt-4'>
        <div className='flex flex-col gap-2 w-full'>
          <Input onChange={(e) => setMessage(e.target.value)} value={message}></Input>
          <Button>Send</Button>
        </div>
        <div className='w-full h-full bg-accent rounded-lg p-4'>
          {reachable ? (
            <MessageList />
          ) : (
            <div className='flex flex-col gap-2'>
              <p>Not connected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MessageList() {
  const { streamMessages } = useGrpcContext()

  return (
    <div className='flex flex-col gap-2'>
      {streamMessages.map((message) => (
        <MessageItem key={message.id} message={message.Clipboard || message.GenericText || message.ConnectedDevices} type={message.type} />
      ))}
    </div>
  )
}

function MessageItem({ message, type }: { message: ClipboardMessage | GenericTextMessage | ConnectedDevices | undefined, type: MessageType}) {

  function getMessage(): string | undefined {
    if (!message) return undefined
    if (type === MessageType.CLIPBOARD) {
      return (message as ClipboardMessage).content
    } else if (type === MessageType.GENERIC_TEXT) {
      return (message as GenericTextMessage).text
    } else if (type === MessageType.CONNECTED_DEVICES) {
      return (message as ConnectedDevices).devices.map((device) => device.name).join(', ');
    }
    return undefined
  }
  const messageText = getMessage()
  console.log(messageText);

  return (
    <div className='flex flex-row gap-2'>
      <div className='w-10 h-10 bg-accent rounded-full'>{messageText}</div>
    </div>
  )
}
