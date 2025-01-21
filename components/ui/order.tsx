import { Package } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Order {
  id: string;
  date: string;
  items: string[];
  total: number;
  status: string;
}

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-zinc-100">Order History</CardTitle>
        <CardDescription className="text-zinc-400">View your past orders and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <div key={order.id} className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0">
              <div className="flex items-center space-x-4">
                <div className="bg-zinc-800 p-3 rounded-full">
                  <Package className="h-6 w-6 text-zinc-400" />
                </div>
                <div>
                  <p className="font-medium text-zinc-100">Order #{order.id}</p>
                  <p className="text-sm text-zinc-400">{order.date}</p>
                  <p className="text-sm text-zinc-400">{order.items.join(', ')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-zinc-100">${order.total.toFixed(2)}</p>
                <p className="text-sm text-zinc-400">{order.status}</p>
                <div className="space-x-2 mt-2">
                  <Button variant="outline" size="sm" className="text-blue-400 border-blue-400 hover:bg-blue-400/10">Track Order</Button>
                  <Button variant="outline" size="sm" className="text-green-400 border-green-400 hover:bg-green-400/10">Reorder</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

