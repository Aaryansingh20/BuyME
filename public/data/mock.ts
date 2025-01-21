type mockUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  loyaltyPoints?: number; // Optional if not always used
};

export const mockUser = {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    avatar: '/placeholder.svg?height=100&width=100',
    address: '123 Main St, Anytown, AN 12345',
    loyaltyPoints: 250,
  }
  type PaymentMethod = {
    id: string
    type: "Credit Card" | "PayPal"
    last4?: string
    expiryDate?: string
    email?: string
  }
  
  
  export const mockOrders = [
    { id: '1234', date: '2023-06-01', total: 125.99, status: 'Delivered', items: ['Product A', 'Product B'] },
    { id: '5678', date: '2023-05-15', total: 79.99, status: 'Processing', items: ['Product C'] },
    { id: '9012', date: '2023-04-30', total: 199.99, status: 'Shipped', items: ['Product D', 'Product E', 'Product F'] },
  ]
  
  export const mockWishlist = [
    { id: 'w1', name: 'Wireless Headphones', price: 89.99, image: '/placeholder.svg?height=50&width=50' },
    { id: 'w2', name: 'Smart Watch', price: 199.99, image: '/placeholder.svg?height=50&width=50' },
    { id: 'w3', name: 'Portable Charger', price: 39.99, image: '/placeholder.svg?height=50&width=50' },
  ]
  
  export const mockAddresses = [
    { id: 'a1', name: 'Home', address: '123 Main St, Anytown, AN 12345', isDefault: true },
    { id: 'a2', name: 'Work', address: '456 Office Blvd, Workville, WK 67890', isDefault: false },
  ]
  
  export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "Credit Card",
    last4: "1234",
    expiryDate: "12/25",
  },
  {
    id: "2",
    type: "PayPal",
    email: "user@example.com",
  },
]

  
  export const mockNotifications = [
    { id: 'n1', message: 'Your order #1234 has been delivered', date: '2023-06-02', read: false },
    { id: 'n2', message: '20% off sale on all electronics!', date: '2023-06-01', read: true },
    { id: 'n3', message: 'New items added to your wishlist are now on sale', date: '2023-05-30', read: false },
  ]
  
  