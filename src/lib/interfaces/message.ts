type ClipboardMessage = {
    content: string
}

type AuthResponse = {
    token: string
}

type GenericTextMessage = {
    content: string
}

type Empty = {}

type ServerMessage = {
    id: string
    senderId: string
    createdAt: number
    type: 'clipboard' | 'auth' | 'generic_text'
    payload: ClipboardMessage | AuthResponse | GenericTextMessage
}

type ClientMessage = {
    id: string
    token: string
    createdAt: number
    type: 'clipboard' | 'generic_text' | 'auth'
    payload: ClipboardMessage | GenericTextMessage | Empty
}