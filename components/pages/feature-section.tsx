import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import grid1 from "@/public/feature/advertising_ adore fall _ winter campaign featuring josephine skriver - ceft and company new york.jpg"
import grid2 from "@/public/feature/2 (3).jpg"
import grid3 from "@/public/feature/3 (2).jpg"
import grid4 from "@/public/feature/Still Crazy.jpg"
import grid5 from "@/public/feature/57398745-441f-4c3c-9d12-0cb75c2e748c.jpg"
import grid6 from "@/public/feature/W컨셉(W CONCEPT).jpg"
import grid9 from "@/public/feature/download (2).jpg"
import grid10 from "@/public/feature/MUSINSA RMTC EVENT BANNER.jpg"
import grid11 from "@/public/feature/download (3).jpg"

const cta =
  "inline-flex w-fit items-center justify-center rounded-md bg-white px-6 py-2 text-sm font-semibold uppercase tracking-wider text-black transition-all duration-300 ease-in-out group-hover:scale-105 hover:bg-gray-200"

export default function FeaturesSection() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Service Features */}
      <div className="container mx-auto p-4 sm:p-6">
        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Hero Section */}
          <Link href="/collection/women-style" className="block group">
            <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden h-full">
              <Image
                src={grid1}
                alt="Women's Style"
                width={600}
                height={400}
                className="object-cover w-full h-full absolute inset-0"
              />
              <div className="p-6 flex flex-col h-full justify-between relative z-10 bg-gradient-to-t from-black to-transparent">
                <div>
                  <span className="text-blue-500 font-medium uppercase tracking-wider">New Arrivals</span>
                  <h2 className="text-2xl text-white sm:text-3xl font-bold mt-2 mb-2 uppercase tracking-wider">Women&apos;s Style</h2>
                  <p className="text-zinc-200 mb-6 uppercase tracking-wider">Up to 70% Off</p>
                </div>
                <span className={cta}>Shop Now</span>
              </div>
            </Card>
          </Link>

          {/* Product Categories */}
          <div className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Handbag Card */}
              <Link href="/collection/handbags" className="block group">
                <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden h-full min-h-[200px]">
                  <Image
                    src={grid2}
                    alt="Carry the look"
                    width={300}
                    height={200}
                    className="object-cover w-full h-full absolute inset-0"
                  />
                  <div className="p-4 relative z-10 bg-gradient-to-t from-black to-transparent h-full flex flex-col justify-end">
                    <span className={cta}>Shop Now</span>
                  </div>
                </Card>
              </Link>

              {/* Watch Card */}
              <Link href="/collection/watches" className="block group">
                <Card className="bg-zinc-900 h-[200px] border-zinc-800 relative overflow-hidden">
                  <Image
                    src={grid4}
                    alt="Time pieces"
                    width={300}
                    height={200}
                    className="object-cover w-full h-full absolute inset-0"
                  />
                  <div className="p-4 relative z-10 bg-gradient-to-t from-black to-transparent h-full flex flex-col justify-end">
                    <span className={cta}>Shop Now</span>
                  </div>
                </Card>
              </Link>
            </div>

            {/* Accessories Card */}
            <Link href="/collection/accessories" className="block group">
              <Card className="bg-zinc-900 h-[200px] border-zinc-800 relative overflow-hidden">
                <Image
                  src={grid3}
                  alt="Accessories"
                  width={600}
                  height={200}
                  className="object-cover w-full h-full absolute inset-0"
                />
                <div className="p-6 relative z-10 bg-gradient-to-r from-black to-transparent h-full flex flex-col justify-center">
                  <h3 className="text-xl text-white font-bold mb-2 uppercase tracking-wider">Accessories</h3>
                  <p className="text-zinc-200 mb-4 uppercase tracking-wider">Min. 40-60% Off</p>
                  <span className={cta}>Shop Now</span>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Additional Boxes */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* New Arrivals */}
          <Link href="/collection/new-arrivals" className="block group md:col-span-2">
            <Card className="bg-zinc-900 h-[500px] border-zinc-800 relative overflow-hidden">
              <Image
                src={grid6}
                alt="New Arrivals"
                width={600}
                height={300}
                className="object-cover w-full h-full absolute inset-0"
              />
              <div className="p-6 relative z-10 bg-gradient-to-r from-black to-transparent h-full flex flex-col justify-center">
                <h2 className="text-2xl text-white sm:text-3xl font-bold mt-2 mb-2 uppercase tracking-wider">New Arrivals</h2>
                <p className="text-zinc-200 mb-6 uppercase tracking-wider">Discover the Latest Trends</p>
                <span className={cta}>Shop Collection</span>
              </div>
            </Card>
          </Link>

          {/* Sale Banner */}
          <Link href="/collection/summer-sale" className="block group">
            <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden h-full min-h-[500px]">
              <Image
                src={grid5}
                alt="Summer Sale"
                width={300}
                height={300}
                className="object-cover w-full h-full absolute inset-0"
              />
              <div className="p-6 relative z-10 bg-gradient-to-t from-black to-transparent h-full flex flex-col justify-end items-center text-center">
                <h3 className="text-3xl font-bold mb-2 uppercase tracking-wider">Summer Sale</h3>
                <p className="text-zinc-200 mb-4 uppercase tracking-wider">Up to 70% Off</p>
                <span className={cta}>Shop Sale</span>
              </div>
            </Card>
          </Link>
        </div>

        {/* Brand Spotlight */}
        <Link href="/collection/nike" className="block group">
          <Card className="mt-6 bg-zinc-900 h-[300px] border-zinc-800 relative overflow-hidden">
            <Image
              src={grid11}
              alt="Brand Spotlight"
              width={1200}
              height={400}
              className="object-cover w-full h-full absolute inset-0"
            />
            <div className="p-8 relative z-10 bg-gradient-to-r from-black to-transparent h-full flex flex-col justify-center max-w-lg">
              <span className="text-blue-500 font-medium uppercase tracking-wider">Featured Brand</span>
              <p className="text-zinc-200 my-4">Discover the latest innovations in sportswear and athletic shoes.</p>
              <span className={cta}>Explore Now</span>
            </div>
          </Card>
        </Link>

        {/* Limited Time Offers */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">Limited Time Offers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/collection/flash-sale" className="block group">
              <Card className="bg-zinc-900 h-[300px] border-zinc-800 relative overflow-hidden">
                <Image
                  src={grid9}
                  alt="Flash Sale"
                  width={600}
                  height={300}
                  className="object-cover w-full h-full absolute inset-0"
                />
                <div className="p-6 relative z-10 bg-gradient-to-t from-black to-transparent h-full flex flex-col justify-end">
                  <h3 className="text-2xl text-white font-bold mb-2 uppercase tracking-wider">Flash Sale</h3>
                  <p className="text-zinc-200 mb-4">24 Hours Only - Up to 80% Off Select Items</p>
                  <span className={cta}>Shop Flash Sale</span>
                </div>
              </Card>
            </Link>
            <Link href="/collection/clearance" className="block group">
              <Card className="bg-zinc-900 h-[300px] border-zinc-800 relative overflow-hidden">
                <Image
                  src={grid10}
                  alt="Clearance"
                  width={600}
                  height={300}
                  className="object-cover w-full h-full absolute inset-0"
                />
                <div className="p-6 relative z-10 bg-gradient-to-t from-black to-transparent h-full flex flex-col justify-end">
                  <h3 className="text-2xl text-white font-bold mb-2 uppercase tracking-wider">Clearance</h3>
                  <p className="text-zinc-200 mb-4">Final Markdowns - Extra 20% Off Already Reduced Prices</p>
                  <span className={cta}>Shop Clearance</span>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
