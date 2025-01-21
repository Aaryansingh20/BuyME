import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface WishlistItem {
  id: string
  name: string
  price: number
  image?: string
}

interface WishlistProps {
  items: WishlistItem[]
}

export function Wishlist({ items }: WishlistProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl text-zinc-100">Wishlist</CardTitle>
        <CardDescription className="text-sm sm:text-base text-zinc-400">
          Items you&apos;ve saved for later
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800 pb-4 last:border-0"
            >
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-cover rounded bg-zinc-800 w-16 h-16"
                />
                <div>
                  <p className="font-medium text-sm sm:text-base text-zinc-100">{item.name}</p>
                  <p className="text-xs sm:text-sm text-zinc-400">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs sm:text-sm">
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-zinc-100 text-zinc-900 hover:bg-zinc-200  text-xs sm:text-sm"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

