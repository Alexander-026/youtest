export type Conversation = {
    id: string
    participant: Participant
    messages: Message[]
}

export type UnreadMessage = {
    conversationId: string
    count: number
}

export type Participant = {
    id: string
    firstName: string
    lastName: string
    image: string
    wasOnline: string
}

export type Message = {
    id: string
    senderId: string
    receiverId: string
    conversationId: string
    message: string
    isRead: boolean
    createdAt: string
    updatedAt: string
}