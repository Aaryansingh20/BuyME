import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define the type for items
interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface WishlistProps {
  items: WishlistItem[];
}

export function Wishlist({ items }: WishlistProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-zinc-100">Wishlist</CardTitle>
        <CardDescription className="text-zinc-400">Items you&apos;ve saved for later</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0"
            >
              <div className="flex items-center space-x-4">
                {/* Use Next.js Image */}
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-cover rounded bg-zinc-800"
                />
                <div>
                  <p className="font-medium text-zinc-100">{item.name}</p>
                  <p className="text-sm text-zinc-400">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="space-x-2">
                <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">Add to Cart</Button>
                <Button
                  variant="outline"
                  className="text-zinc-100 border-zinc-700 hover:bg-zinc-800"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
