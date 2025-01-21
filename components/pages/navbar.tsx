"use client"

import { useState } from "react"
import Link from "next/link"
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

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <nav className="border-b border-gray-700 bg-black text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-center gap-4">
          <div className="flex items-center justify-between w-full max-w-7xl">
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
                    <Link href="/" className="text-3xl font-bold uppercase tracking-wider text-white">
                      BuyME
                    </Link>
                  </div>
                  <div className="flex-1 overflow-auto py-6">
                    <div className="space-y-6 px-4">
                      <Link href="/" className="block text-lg font-medium uppercase tracking-wider text-white hover:text-gray-300 transition-colors">
                        Home
                      </Link>
                      <div className="space-y-2">
                        <span className="block text-lg font-medium uppercase tracking-wider text-white">Games</span>
                        <Link href="/games/action" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Action
                        </Link>
                        <Link href="/games/adventure" className="block text-sm  uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Adventure
                        </Link>
                        <Link href="/games/rpg" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          RPG
                        </Link>
                      </div>
                      <div className="space-y-2">
                        <span className="block text-lg font-medium text-white">Sale</span>
                        <Link href="/sale/weekly" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Weekly Deals
                        </Link>
                        <Link href="/sale/clearance" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Clearance
                        </Link>
                        <Link href="/sale/bundles" className="block text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors pl-4">
                          Bundles
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

            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-white">
              BuyME
            </Link>

            {/* Desktop Navigation - Hidden on mobile, visible on larger screens */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium uppercase tracking-wider text-white hover:text-gray-300 hover:bg-black transition-colors px-3 py-2">
                Home
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium uppercase tracking-wider text-white hover:text-gray-300 hover:bg-black transition-colors">
                    Games <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black border border-gray-700 rounded-md p-1">
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/games/action" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Action</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/games/adventure" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Adventure</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/games/rpg" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">RPG</Link>
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
                    <Link href="/sale/weekly" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Weekly Deals</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/sale/clearance" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Clearance</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 rounded-sm">
                    <Link href="/sale/bundles" className="text-gray-300 uppercase tracking-wider hover:text-white transition-colors py-2 px-3 block w-full">Bundles</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block max-w-lg w-full">
              <div className="relative flex w-full items-center">
                <Input
                  type="search"
                  placeholder="Search for products"
                  className="w-full rounded-sm bg-zinc-900 border-zinc-800 pr-12 text-sm text-white placeholder:text-gray-400 focus-visible:ring-white"
                />
                <Button size="icon" className="absolute right-0 h-full px-3 bg-transparent hover:bg-gray-700">
                  <Search className="h-4 w-4 text-white" />
                  <span className="sr-only uppercase tracking-wider">Search</span>
                </Button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
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
              <Button variant="ghost" size="icon" className="text-white hover:text-gray-300 hover:bg-transparent">
                <div className="relative">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-black">
                    0
                  </span>
                </div>
                <span className="sr-only uppercase tracking-wider">Wishlist</span>
              </Button>
              <Link href="/product/cartpage">
              <Button variant="ghost" size="icon" className="text-white hover:text-gray-300 hover:bg-transparent">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-black">
                    0
                  </span>
                </div>
                <span className="sr-only uppercase tracking-wider">Cart</span>
              </Button>
              </Link>
              <span className="text-sm hidden sm:inline-block text-white uppercase tracking-wider">$0.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="lg:hidden border-t border-gray-700 bg-black p-4">
          <div className="relative flex w-full items-center">
            <Input
              type="search"
              placeholder="Search for products"
              className="w-full rounded-none border-gray-700 bg-gray-800 pr-12 text-sm text-white placeholder:text-gray-400 focus-visible:ring-white"
            />
            <Button size="icon" className="absolute right-0 h-full px-3 bg-transparent hover:bg-gray-700">
              <Search className="h-4 w-4 text-white" />
              <span className="sr-only uppercase tracking-wider">Search</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

