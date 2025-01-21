import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Order {
  id: string
  date: string
  items: string[]
  total: number
  status: string
}

interface OrderHistoryProps {
  orders: Order[]
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl text-zinc-100">Order History</CardTitle>
        <CardDescription className="text-sm sm:text-base text-zinc-400">
          View your past orders and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 last:border-0"
            >
              <div className="flex items-start sm:items-center space-x-4 mb-4 sm:mb-0">
                <div className="bg-zinc-800 p-3 rounded-full">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-400" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base text-zinc-100">Order #{order.id}</p>
                  <p className="text-xs sm:text-sm text-zinc-400">{order.date}</p>
                  <p className="text-xs sm:text-sm text-zinc-400">{order.items.join(", ")}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-medium text-sm sm:text-base text-zinc-100">${order.total.toFixed(2)}</p>
                <p className="text-xs sm:text-sm text-zinc-400 mb-2 sm:mb-0">{order.status}</p>
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-xs sm:text-sm bg-zinc-100 text-zinc-900 hover:bg-zinc-200 "
                  >
                    Track Order
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-xs sm:text-sm bg-zinc-100 text-zinc-900 hover:bg-zinc-200 "
                  >
                    Reorder
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

