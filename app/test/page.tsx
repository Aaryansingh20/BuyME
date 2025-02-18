"use client"

import { useState } from "react"

export default function Home() {
  const [cartCount, setCartCount] = useState(0)
  const [likesCount, setLikesCount] = useState(0)
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set())

  const addToCart = () => {
    setCartCount((prevCount) => prevCount + 1)
  }

  const toggleLike = (itemId: number) => {
    setLikedItems((prevLikedItems) => {
      const newLikedItems = new Set(prevLikedItems)
      if (newLikedItems.has(itemId)) {
        newLikedItems.delete(itemId)
        setLikesCount((prevCount) => prevCount - 1)
      } else {
        newLikedItems.add(itemId)
        setLikesCount((prevCount) => prevCount + 1)
      }
      return newLikedItems
    })
  }

  return (
    <div>
      <div>Cart Items: {cartCount}</div>
      <div>Liked Items: {likesCount}</div>
      <button onClick={addToCart}>Add to Cart</button>
      {[1, 2, 3, 4, 5].map((itemId) => (
        <button
          key={itemId}
          onClick={() => toggleLike(itemId)}
          style={{ color: likedItems.has(itemId) ? "red" : "black" }}
        >
          {likedItems.has(itemId) ? "Unlike" : "Like"} Item {itemId}
        </button>
      ))}
    </div>
  )
}

