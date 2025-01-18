import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import grid1 from "@/public/feature/advertising_ adore fall _ winter campaign featuring josephine skriver - ceft and company new york.jpg"
import grid2 from "@/public/feature/2 (3).jpg"
import grid3 from "@/public/feature/3 (2).jpg"
import grid4 from "@/public/feature/Still Crazy.jpg"
import grid5 from "@/public/feature/57398745-441f-4c3c-9d12-0cb75c2e748c.jpg"
import grid6 from "@/public/feature/W컨셉(W CONCEPT).jpg"
// import grid7 from "@/public/feature/Screenshot.jpg"
// import grid8 from "@/public/feature/ZY _ BOTTOMSボトムスって何をはいたらお洒落？コーデの悩みを人気アイテムで解決.jpg"
import grid9 from "@/public/feature/download (2).jpg"
import grid10 from "@/public/feature/MUSINSA RMTC EVENT BANNER.jpg"
import grid11 from "@/public/feature/download (3).jpg"




export default function FeaturesSection() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Service Features */}
      <div className="container mx-auto p-4 sm:p-6">

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Hero Section */}
          <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
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
              <Button variant="secondary" className="w-fit bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105">
                Shop Now
              </Button>
            </div>
          </Card>

          {/* Product Categories */}
          <div className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Handbag Card */}
              <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
                <Image
                  src={grid2}
                  alt="Handbag"
                  width={300}
                  height={200}
                  className="object-cover w-full h-full absolute inset-0"
                />
                <div className="p-4 relative z-10 bg-gradient-to-t from-black to-transparent h-full flex flex-col justify-end">
                  <Button variant="secondary" size="sm" className='w-fit bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105'>
                    Shop Now
                  </Button>
                </div>
              </Card>

              {/* Watch Card */}
              <Card className="bg-zinc-900 h-[200px] border-zinc-800 relative overflow-hidden">
                <Image
                  src={grid4}
                  alt="Watch"
                  width={300}
                  height={200}
                  className="object-cover w-full h-full absolute inset-0"
                />
                <div className="p-4 relative z-10 bg-gradient-to-t from-black to-transparent h-full flex flex-col justify-end">
                  <Button variant="secondary" size="sm" className='w-fit bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105'>
                    Shop Now
                  </Button>
                </div>
              </Card>
            </div>

            {/* Accessories Card */}
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
                <Button variant="secondary" className='w-fit bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105'>Shop Now</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Boxes */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* New Arrivals */}
          <Card className="bg-zinc-900 h-[500px] border-zinc-800 col-span-2 relative overflow-hidden">
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
              <Button variant="secondary" className="w-fit bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105">
                Shop Collection
              </Button>
            </div>
          </Card>

          {/* Sale Banner */}
          <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
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
              <Button variant="secondary" className="w-fit bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105">Shop Sale</Button>
            </div>
          </Card>
        </div>

        {/* Featured Products Grid */}
        {/* <div className="grid md:grid-cols-4 gap-6 mt-6">
          {[
            { title: "Sneakers", discount: "20% OFF" },
            { title: "Denim", discount: "30% OFF" },
            { title: "Accessories", discount: "15% OFF" },
            { title: "Outerwear", discount: "25% OFF" },
          ].map((product, index) => (
            <Card key={index} className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
              <Image
                src={`/placeholder.svg?height=200&width=200&text=${product.title}`}
                alt={product.title}
                width={200}
                height={200}
                className="object-cover w-full h-48 absolute inset-0"
              />
              <div className="p-4 relative z-10 bg-gradient-to-t from-black to-transparent h-full flex flex-col justify-end">
                <Button variant="secondary" size="sm" className='w-fit'>
                  Shop Now
                </Button>
              </div>
            </Card>
          ))}
        </div> */}

        {/* New Sections */}
        {/* Trending Now */}
        {/* <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">Trending Now</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Summer Dresses", image: "summer-dresses" },
              { title: "Activewear", image: "activewear" },
              { title: "Designer Sunglasses", image: "sunglasses" },
            ].map((item, index) => (
              <Card key={index} className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=300&width=400&text=${item.image}`}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="object-cover w-full h-64 absolute inset-0"
                />
                <div className="p-4 relative z-10 bg-gradient-to-t from-black to-transparent h-full flex flex-col justify-end">
                  <Button variant="secondary" size="sm" className='w-fit'>
                    Shop Collection
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div> */}

        {/* Brand Spotlight */}
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
            <br/>
            <p className="text-zinc-200 mb-6">Discover the latest innovations in sportswear and athletic shoes from Nike.</p>
            <Button variant="secondary" className="w-fit bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105">
              Explore Nike
            </Button>
          </div>
        </Card>

        {/* Limited Time Offers */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">Limited Time Offers</h2>
          <div className="grid md:grid-cols-2 gap-6">
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
                <Button variant="secondary" className='w-fit bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105'>
                  Shop Flash Sale
                </Button>
              </div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
              <Image
                src={grid10}
                alt="Clearance"
                width={600}
                height={300}
                className="object-cover w-full h-64 absolute inset-0"
              />
              <div className="p-6 relative z-10 bg-gradient-to-t from-black to-transparent h-full flex flex-col justify-end">
                <h3 className="text-2xl text-white font-bold mb-2 uppercase tracking-wider">Clearance</h3>
                <p className="text-zinc-200 mb-4">Final Markdowns - Extra 20% Off Already Reduced Prices</p>
                <Button variant="secondary" className='w-fit bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105'>
                  Shop Clearance
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

