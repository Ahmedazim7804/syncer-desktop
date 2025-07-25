import { Settings } from 'lucide-react'

export default function navbar() {
  return (
    <div className='p-2 flex justify-between items-center bg-sidebar border-0'>
        <div className='flex items-center gap-2'>
            <Settings/>
            <h1>Settings</h1>
        </div>
    </div>
  )
}
