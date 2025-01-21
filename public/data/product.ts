export interface Product {
    id: string
    name: string
    image: string
    rating: number
    category: string
    price: number
  }
  
  export const products: Product[] = [
    {
      id: "1",
      name: "Apex Pro Gaming Mouse",
      image: "/placeholder.svg?height=200&width=200",
      rating: 5,
      category: "Gaming Mouse",
      price: 59.99,
    },
    {
      id: "2",
      name: "Stellar Series Headset",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4,
      category: "Gaming Headset",
      price: 89.99,
    },
    {
      id: "3",
      name: "Elite Controller Pro",
      image: "/placeholder.svg?height=200&width=200",
      rating: 5,
      category: "Controller",
      price: 149.99,
    },
    {
      id: "4",
      name: "RGB Mechanical Keyboard",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4,
      category: "Keyboard",
      price: 129.99,
    },
    {
      id: "5",
      name: "Wireless Gaming Mouse",
      image: "/placeholder.svg?height=200&width=200",
      rating: 5,
      category: "Gaming Mouse",
      price: 79.99,
    },
  ]
  
  