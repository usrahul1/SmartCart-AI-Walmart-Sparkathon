export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
}

export interface CartItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}
