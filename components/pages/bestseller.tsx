import Image from "next/image"
import Link from "next/link"
import urbanClothes1 from "@/public/images/one-3view.jpg"
import urbanClothes2 from "@/public/images/two-3view.jpg"
import urbanClothes3 from "@/public/images/three-3view.jpg"

export default function BestsellerSection() {
  return (
    <div className="bg-black text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl text-center uppercase tracking-wider mb-6">Our Bestseller</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/product/dark-series-jacket" className="block group">
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-900">
                <Image
                  src={urbanClothes1 || "/placeholder.svg"}
                  alt="Dark series jacket"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <div className="mt-3 flex justify-between items-center">
                <p className="text-sm text-gray-400">Dark series jacket</p>
                <p className="text-sm">$95</p>
              </div>
            </div>
          </Link>
          
          <Link href="/product/urban-style-coat" className="block group">
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-900">
                <Image
                  src={urbanClothes2 || "/placeholder.svg"}
                  alt="Urban style coat"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <div className="mt-3 flex justify-between items-center">
                <p className="text-sm text-gray-400">Urban style coat</p>
                <p className="text-sm">$85</p>
              </div>
            </div>
          </Link>
          
          <Link href="/product/classic-noir-wear" className="block group">
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-900">
                <Image
                  src={urbanClothes3 || "/placeholder.svg"}
                  alt="Classic noir wear"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <div className="mt-3 flex justify-between items-center">
                <p className="text-sm text-gray-400">Classic noir wear</p>
                <p className="text-sm">$75</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

