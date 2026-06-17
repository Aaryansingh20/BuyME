"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, Heart, ShoppingCart, Instagram, Youtube, Disc, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/hooks/cartcontext"
import { useWishlist } from "@/hooks/wishlistcontext"
import { Logo } from "@/components/ui/logo"
import { Price } from "@/components/ui/price"
import { CurrencySwitcher } from "@/components/ui/currency-switcher"

export default function Navbar() {
  const { count: cartCount, subtotal } = useCart();
  const { count: wishlistCount } = useWishlist();
  const router = useRouter()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [hidden, setHidden] = useState(false)

  // Hide the navbar while scrolling down, reveal it the moment the user scrolls up.
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y > lastY && y > 80) {
        setHidden(true) // scrolling down past the bar
      } else if (y < lastY) {
        setHidden(false) // any upward scroll brings it back
      }
      lastY = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
    setIsSearchOpen(false)
  }

  return (
    <>
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b border-gray-700 bg-black text-white transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-center gap-4">
          <div className="flex min-w-0 items-center justify-between gap-2 w-full max-w-7xl">
            {/* Mobile Menu - Only visible on small screens */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:text-gray-300 hover:bg-transparent">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-black p-0">
                <div className="flex h-full flex-col">
                  <div className="border-b border-gray-700 p-4">
                    <Link href="/">
                      <Logo />
                    </Link>
                  </div>
                  <div className="flex-1 overflow-auto py-6">
                    <div className="space-y-6 px-4">
                      <Link href="/" className="block text-lg font-medium uppercase tracking-wider text-white hover:text-gray-300 transition-colors">
                        Home
                      </Link>
                      <div className="space-y-2">
                        <span className="block text-lg font-medium uppercase tracking-wider text-white">Shop</span>
                        <Link href="/shop" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          All Products
                        </Link>
                        <Link href="/shop?category=Jackets" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Jackets
                        </Link>
                        <Link href="/shop?category=T-Shirts" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          T-Shirts
                        </Link>
                        <Link href="/shop?category=Jeans" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Jeans
                        </Link>
                        <Link href="/shop?category=Formal%20Wear" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Formal Wear
                        </Link>
                      </div>
                      <div className="space-y-2">
                        <span className="block text-lg font-medium uppercase tracking-wider text-white">Collections</span>
                        <Link href="/collection/new-arrivals" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          New Arrivals
                        </Link>
                        <Link href="/collection/women-style" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Women&apos;s Style
                        </Link>
                        <Link href="/collection/accessories" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Accessories
                        </Link>
                      </div>
                      <div className="space-y-2">
                        <span className="block text-lg font-medium uppercase tracking-wider text-white">Sale</span>
                        <Link href="/collection/summer-sale" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Summer Sale
                        </Link>
                        <Link href="/collection/flash-sale" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Flash Sale
                        </Link>
                        <Link href="/collection/clearance" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Clearance
                        </Link>
                      </div>
                    </div>
                    <div className="mt-10 space-y-6 border-t border-gray-700 px-4 pt-10">
                      <div className="flex space-x-6">
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          <Instagram className="h-6 w-6" />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          <Youtube className="h-6 w-6" />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          <Disc className="h-6 w-6" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Navigation - Hidden on mobile, visible on larger screens */}
            <div className="hidden lg:flex items-center space-x-4 lg:mr-4 shrink-0">
              <Link href="/" className="text-sm font-medium uppercase tracking-wider text-white hover:text-gray-300 hover:bg-black transition-colors px-3 py-2">
                Home
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium uppercase tracking-wider text-white hover:text-gray-300 hover:bg-black transition-colors">
                    Shop <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black border border-gray-700 rounded-md p-1">
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/shop" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">All Products</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/shop?category=Jackets" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Jackets</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/shop?category=T-Shirts" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">T-Shirts</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/shop?category=Jeans" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Jeans</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/shop?category=Formal%20Wear" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Formal Wear</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium uppercase tracking-wider text-white hover:text-gray-300 hover:bg-black transition-colors">
                    Collections <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black border border-gray-700 rounded-md p-1">
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/collection/new-arrivals" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">New Arrivals</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/collection/women-style" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Women&apos;s Style</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/collection/accessories" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Accessories</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium uppercase tracking-wider text-white hover:text-gray-300 hover:bg-black transition-colors">
                    Sale <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black border border-gray-700 rounded-md p-1">
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/collection/summer-sale" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Summer Sale</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/collection/flash-sale" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Flash Sale</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/collection/clearance" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Clearance</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex min-w-0 flex-1 max-w-sm">
              <form onSubmit={handleSearch} className="relative flex w-full items-center">
                <Input
                  type="search"
                  placeholder="Search for products"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-sm bg-zinc-900 border-zinc-800 pr-12 text-sm text-white placeholder:text-gray-400 focus-visible:ring-white"
                />
                <Button type="submit" size="icon" className="absolute right-0 h-full px-3 bg-transparent hover:bg-gray-700">
                  <Search className="h-4 w-4 text-white" />
                  <span className="sr-only uppercase tracking-wider">Search</span>
                </Button>
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:text-gray-300 hover:bg-transparent"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>
              <Link href='/product/profile'>
              <Button variant="ghost" size="icon" className="text-white hover:text-gray-300 hover:bg-transparent">
                <User className="h-5 w-5" />
                <span className="sr-only uppercase tracking-wider">Account</span>
              </Button>
              </Link>
              <Link href="/product/profile?tab=wishlist">
              <Button variant="ghost" size="icon" className="text-white hover:text-gray-300 hover:bg-transparent">
                <div className="relative">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-black">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="sr-only uppercase tracking-wider">Wishlist</span>
              </Button>
              </Link>
              <Link href="/product/cartpage">
              <Button variant="ghost" size="icon" className="text-white hover:text-gray-300 hover:bg-transparent">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-black">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="sr-only uppercase tracking-wider">Cart</span>
              </Button>
              </Link>
              <CurrencySwitcher />
              <Price amount={subtotal} className="text-sm hidden sm:inline-block text-white uppercase tracking-wider" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="lg:hidden border-t border-gray-700 bg-black p-4">
          <form onSubmit={handleSearch} className="relative flex w-full items-center">
            <Input
              type="search"
              placeholder="Search for products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full rounded-none border-gray-700 bg-gray-800 pr-12 text-sm text-white placeholder:text-gray-400 focus-visible:ring-white"
            />
            <Button type="submit" size="icon" className="absolute right-0 h-full px-3 bg-transparent hover:bg-gray-700">
              <Search className="h-4 w-4 text-white" />
              <span className="sr-only uppercase tracking-wider">Search</span>
            </Button>
          </form>
        </div>
      )}
    </nav>
    {/* Spacer so fixed navbar doesn't overlap page content */}
    <div className="h-20" aria-hidden />
    </>
  )
}

