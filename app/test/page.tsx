"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, Mail, Plus, Search, User } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Template {
  subject: string
  image: string
  vertical: string
  category: string
}

type AdvancedOptions = {
  [key: string]: string[]
}

const verticals = [
  "Announcement",
  "Re-engagement",
  "Newsletter",
  "Welcome",
  "Events",
  "Survey",
  "Reviews",
  "Back in stock",
  "Cart Abandon",
  "Transactional",
]

const advancedOptions: AdvancedOptions = {
  Announcement: [
    "Beauty",
    "Beverage",
    "Furniture",
    "Food",
    "Jewelry",
    "Automotive",
    "Footwear",
    "Clothing",
    "Coffee",
    "Pets",
    "Restaurants",
    "SaaS",
    "Digital Products",
    "Ecommerce",
  ],
  "Re-engagement": ["Clothing", "Beverage", "Automotive"],
  Newsletter: [
    "Digital Products",
    "Beauty",
    "Clothing",
    "SaaS",
    "B2B",
    "Gaming",
    "Food",
    "Automotive",
    "Pets",
    "Coffee",
    "Fitness",
  ],
  Welcome: [
    "Travel",
    "Clothing",
    "Food",
    "Beverage",
    "Pets",
    "Beauty",
    "Footwear",
    "Furniture",
    "SaaS",
    "Digital Products",
    "Ecommerce",
  ],
  Events: ["Ecommerce", "Food", "SaaS"],
  Survey: ["Gaming", "Digital Products", "Coffee", "Health"],
  Reviews: ["Food"],
  "Back in stock": ["Food", "Footwear"],
  "Cart Abandon": ["Food"],
  Transactional: ["Fitness"],
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null)
  const [selectedAdvancedOption, setSelectedAdvancedOption] = useState<string | null>(null)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [activeCategory, setActiveCategory] = useState("Announcement")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  useEffect(() => {
    fetch("/template.json")
      .then((response) => response.json())
      .then((data) => setTemplates(data))
      .catch((error) => console.error("Error fetching templates:", error))
  }, [])

  useEffect(() => {
    setIsSearchActive(searchQuery.trim().length > 0 || selectedVertical !== null || selectedAdvancedOption !== null)
  }, [searchQuery, selectedVertical, selectedAdvancedOption])

  const calculateScore = (text: string, terms: string[]) => {
    return terms.reduce((score, term) => {
      if (text.includes(term)) {
        score += 2
      } else if (terms.some((searchTerm) => text.includes(searchTerm))) {
        score += 1
      }
      return score
    }, 0)
  }

  const filteredTemplates = templates
    .filter((template) => {
      const searchTerms = searchQuery.toLowerCase().split(" ")
      const verticalMatch = selectedVertical ? template.category.toLowerCase() === selectedVertical.toLowerCase() : true
      const advancedOptionMatch = selectedAdvancedOption
        ? template.vertical.toLowerCase() === selectedAdvancedOption.toLowerCase()
        : true
      const categoryMatch = selectedCategory ? template.category.toLowerCase() === selectedCategory.toLowerCase() : true
      const subcategoryMatch = selectedSubcategory
        ? template.vertical.toLowerCase() === selectedSubcategory.toLowerCase()
        : true

      if (!isSearchActive) {
        return verticalMatch && advancedOptionMatch && categoryMatch && subcategoryMatch
      }

      const subjectScore = calculateScore(template.subject.toLowerCase(), searchTerms)
      const verticalScore = calculateScore(template.vertical.toLowerCase(), searchTerms)
      const categoryScore = calculateScore(template.category.toLowerCase(), searchTerms)

      const totalScore = subjectScore + verticalScore + categoryScore

      return totalScore > 0 && verticalMatch && advancedOptionMatch && categoryMatch && subcategoryMatch
    })
    .sort((a, b) => {
      const searchTerms = searchQuery.toLowerCase().split(" ")
      const aScore =
        calculateScore(a.subject.toLowerCase(), searchTerms) +
        calculateScore(a.vertical.toLowerCase(), searchTerms) +
        calculateScore(a.category.toLowerCase(), searchTerms)
      const bScore =
        calculateScore(b.subject.toLowerCase(), searchTerms) +
        calculateScore(b.vertical.toLowerCase(), searchTerms) +
        calculateScore(b.category.toLowerCase(), searchTerms)
      return bScore - aScore
    })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsSearchActive(e.target.value.trim().length > 0)
  }

  const handleVerticalClick = (vertical: string) => {
    setSelectedVertical((prevVertical) => (prevVertical === vertical ? null : vertical))
    setSelectedAdvancedOption(null)
    setIsSearchActive(true)
    setSelectedCategory(vertical)
    setSelectedSubcategory(null)
    setActiveCategory(vertical)
  }

  const handleAdvancedOptionClick = (option: string) => {
    setSelectedAdvancedOption((prevOption) => (prevOption === option ? null : option))
    setIsSearchActive(true)
    setSelectedSubcategory(option)
  }

  return (
    <div className="min-h-screen w-screen bg-white">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="w-full mx-auto px-4">
          <div className="flex items-center h-16 gap-6">
            <Mail className="w-8 h-8 text-[#FF4444]" />
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search by keyword or category"
                  className="pl-10 w-full border-gray-200"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Button variant="destructive" className="hidden md:flex bg-[#FF4444] hover:bg-[#FF4444]/90">
                Upload <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" className="hidden md:flex text-gray-600 font-normal">
                Your Emails
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 border-r min-h-[calc(100vh-64px)] p-4 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-1">
                {verticals.map((vertical) => (
                  <Button
                    key={vertical}
                    variant={selectedVertical === vertical ? "default" : "ghost"}
                    className={`w-full justify-start text-left font-normal ${
                      selectedVertical === vertical ? "bg-[#FF4444] hover:bg-[#FF4444] text-white" : "text-gray-600"
                    }`}
                    onClick={() => handleVerticalClick(vertical)}
                  >
                    {vertical}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Subcategories</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {(selectedVertical ? advancedOptions[selectedVertical] : advancedOptions["Announcement"]).map(
                  (option, index) => (
                    <Button
                      key={`${option}-${index}`}
                      variant={selectedAdvancedOption === option ? "default" : "ghost"}
                      className={`w-full justify-start text-left font-normal ${
                        selectedAdvancedOption === option
                          ? "bg-[#FF4444] hover:bg-[#FF4444] text-white"
                          : "text-gray-600"
                      }`}
                      onClick={() => handleAdvancedOptionClick(option)}
                    >
                      {option}
                    </Button>
                  ),
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredTemplates.map((template, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden group relative">
                <div className="relative aspect-[9/16]">
                  <Image
                    src={template.image || "/placeholder.svg"}
                    alt={template.subject}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 top-0 h-fit bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out flex flex-col justify-between p-4 overflow-y-auto">
                    <div className="space-y-3">
                      <p className="text-black text-sm font-medium leading-snug">{template.subject}</p>
                      <Button size="sm" className="w-fit bg-[#FF4444] hover:bg-[#FF4444]/90 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Save Email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No templates found{" "}
              {selectedCategory && selectedSubcategory
                ? `for ${selectedCategory} - ${selectedSubcategory}`
                : "matching your search"}
              .
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

