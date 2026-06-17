import type { StaticImageData } from "next/image"
import bomber from "@/public/shop/noir-bomber-jacket.png"
import cargo from "@/public/shop/urban-cargo-pants.jpg"
import hoodie from "@/public/shop/oversized-hoodie.jpg"
import tee from "@/public/shop/graphic-print-tee.jpg"
import jeans from "@/public/shop/slim-fit-jeans.jpg"
import overcoat from "@/public/shop/wool-blend-overcoat.jpg"
import shirt from "@/public/shop/classic-white-shirt.jpg"
import set from "@/public/shop/streetwear-set.jpg"
import sweater from "@/public/shop/knit-pullover-sweater.jpg"
import blazer from "@/public/shop/tailored-blazer.jpg"
import denim from "@/public/shop/denim-jacket.jpg"
import trousers from "@/public/shop/pleated-trousers.jpg"
import darkSeries3View from "@/public/images/one-3view.jpg"
import urbanCoat3View from "@/public/images/two-3view.jpg"
import classicNoir3View from "@/public/images/three-3view.jpg"

export interface ShopProduct {
  slug: string
  name: string
  category: string
  price: number
  rating: number
  image: string | StaticImageData
  featured?: boolean
  /** Path to a .glb model in /public for the interactive 3D viewer, if any. */
  model3d?: string
}

// Helper for Unsplash clothing photography (domain allow-listed in next.config).
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`

export const shopProducts: ShopProduct[] = [
  // ---- Featured (shown on the home page) ----
  { slug: "noir-bomber-jacket", name: "Noir Bomber Jacket", category: "Jackets", price: 129.99, rating: 5, image: bomber, featured: true },
  { slug: "urban-cargo-pants", name: "Urban Cargo Pants", category: "Pants", price: 74.99, rating: 4, image: cargo, featured: true },
  { slug: "oversized-hoodie", name: "Oversized Hoodie", category: "Hoodies", price: 64.99, rating: 5, image: hoodie, featured: true },
  { slug: "graphic-print-tee", name: "Graphic Print Tee", category: "T-Shirts", price: 34.99, rating: 4, image: tee, featured: true },
  { slug: "slim-fit-jeans", name: "Slim Fit Jeans", category: "Jeans", price: 79.99, rating: 5, image: jeans, featured: true },
  { slug: "wool-blend-overcoat", name: "Wool Blend Overcoat", category: "Coats", price: 189.99, rating: 5, image: overcoat, featured: true },
  { slug: "classic-white-shirt", name: "Classic White Shirt", category: "Shirts", price: 49.99, rating: 4, image: shirt, featured: true },
  { slug: "streetwear-set", name: "Streetwear Set", category: "Activewear", price: 99.99, rating: 5, image: set, featured: true },
  { slug: "knit-pullover-sweater", name: "Knit Pullover Sweater", category: "Sweaters", price: 69.99, rating: 4, image: sweater, featured: true },
  { slug: "tailored-blazer", name: "Tailored Blazer", category: "Formal Wear", price: 159.99, rating: 5, image: blazer, featured: true },
  { slug: "denim-jacket", name: "Denim Jacket", category: "Jackets", price: 109.99, rating: 4, image: denim, featured: true },
  { slug: "pleated-trousers", name: "Pleated Trousers", category: "Pants", price: 84.99, rating: 4, image: trousers, featured: true },

  // ---- 3D-enabled hero products (interactive .glb viewer on the product page) ----
  { slug: "dark-series-jacket", name: "Dark Series Jacket", category: "Jackets", price: 95, rating: 5, image: darkSeries3View, featured: true, model3d: "/3dmodel/dark-series-jacket.glb" },
  { slug: "urban-style-coat", name: "Urban Style Coat", category: "Coats", price: 85, rating: 4, image: urbanCoat3View, featured: true, model3d: "/3dmodel/hoodie.glb" },
  { slug: "classic-noir-wear", name: "Classic Noir Wear", category: "Jackets", price: 75, rating: 5, image: classicNoir3View, featured: true, model3d: "/3dmodel/one-piece.glb" },

  // ---- Full catalogue (discoverable via search / all-products) ----
  // T-Shirts
  { slug: "classic-crew-tee", name: "Classic Crew Tee", category: "T-Shirts", price: 29.99, rating: 4, image: u("photo-1521572163474-6864f9cf17ab") },
  { slug: "v-neck-tee", name: "V-Neck Tee", category: "T-Shirts", price: 27.99, rating: 4, image: u("photo-1583743814966-8936f5b7be1a") },
  { slug: "long-sleeve-tee", name: "Long Sleeve Tee", category: "T-Shirts", price: 39.99, rating: 5, image: u("photo-1576566588028-4147f3842f27") },
  { slug: "striped-tee", name: "Striped Tee", category: "T-Shirts", price: 32.99, rating: 4, image: u("photo-1503342394128-c104d54dba01") },
  { slug: "pocket-tee", name: "Pocket Tee", category: "T-Shirts", price: 28.99, rating: 4, image: u("photo-1503341504253-dff4815485f1") },

  // Shirts
  { slug: "oxford-shirt", name: "Oxford Shirt", category: "Shirts", price: 54.99, rating: 5, image: u("photo-1603252109303-2751441dd157") },
  { slug: "flannel-shirt", name: "Flannel Shirt", category: "Shirts", price: 59.99, rating: 4, image: u("photo-1618354691373-d851c5c3a990") },
  { slug: "linen-shirt", name: "Linen Shirt", category: "Shirts", price: 49.99, rating: 4, image: u("photo-1521572163474-6864f9cf17ab") },
  { slug: "denim-shirt", name: "Denim Shirt", category: "Shirts", price: 57.99, rating: 4, image: u("photo-1601333144130-8cbb312386b6") },

  // Jeans
  { slug: "skinny-jeans", name: "Skinny Jeans", category: "Jeans", price: 72.99, rating: 4, image: u("photo-1475178626620-a4d074967452") },
  { slug: "bootcut-jeans", name: "Bootcut Jeans", category: "Jeans", price: 76.99, rating: 4, image: u("photo-1542272604-787c3835535d") },
  { slug: "straight-leg-jeans", name: "Straight Leg Jeans", category: "Jeans", price: 78.99, rating: 5, image: u("photo-1582552938357-32b906df40cb") },
  { slug: "distressed-jeans", name: "Distressed Jeans", category: "Jeans", price: 84.99, rating: 4, image: u("photo-1542272604-787c3835535d") },
  { slug: "black-wash-jeans", name: "Black Wash Jeans", category: "Jeans", price: 81.99, rating: 5, image: u("photo-1541099649105-f69ad21f3246") },

  // Pants
  { slug: "chino-trousers", name: "Chino Trousers", category: "Pants", price: 64.99, rating: 4, image: u("photo-1517438476312-10d79c077509") },
  { slug: "jogger-pants", name: "Jogger Pants", category: "Pants", price: 59.99, rating: 4, image: u("photo-1508985307703-52d13b2b58e4") },
  { slug: "wide-leg-pants", name: "Wide Leg Pants", category: "Pants", price: 69.99, rating: 4, image: u("photo-1594938298603-c8148c4dae35") },
  { slug: "corduroy-pants", name: "Corduroy Pants", category: "Pants", price: 67.99, rating: 4, image: u("photo-1519753136092-dad46d3652b1") },

  // Jackets
  { slug: "leather-jacket", name: "Leather Jacket", category: "Jackets", price: 199.99, rating: 5, image: u("photo-1551028719-00167b16eac5") },
  { slug: "classic-bomber", name: "Classic Bomber", category: "Jackets", price: 119.99, rating: 4, image: u("photo-1591047139829-d91aecb6caea") },
  { slug: "windbreaker", name: "Windbreaker", category: "Jackets", price: 89.99, rating: 4, image: u("photo-1547063364-caf7d0be2d48") },
  { slug: "varsity-jacket", name: "Varsity Jacket", category: "Jackets", price: 134.99, rating: 5, image: u("photo-1523205771623-e0faa4d2813d") },

  // Coats
  { slug: "trench-coat", name: "Trench Coat", category: "Coats", price: 179.99, rating: 5, image: u("photo-1507679799987-c73779587ccf") },
  { slug: "puffer-coat", name: "Puffer Coat", category: "Coats", price: 159.99, rating: 4, image: u("photo-1591047139829-d91aecb6caea") },
  { slug: "peacoat", name: "Peacoat", category: "Coats", price: 169.99, rating: 5, image: u("photo-1551028719-00167b16eac5") },

  // Hoodies
  { slug: "zip-up-hoodie", name: "Zip-Up Hoodie", category: "Hoodies", price: 62.99, rating: 4, image: u("photo-1620799140408-edc6dcb6d633") },
  { slug: "cropped-hoodie", name: "Cropped Hoodie", category: "Hoodies", price: 54.99, rating: 4, image: u("photo-1515886657613-9f3515b0c78f") },
  { slug: "heavyweight-hoodie", name: "Heavyweight Hoodie", category: "Hoodies", price: 74.99, rating: 5, image: u("photo-1556821840-3a63f95609a7") },

  // Sweaters
  { slug: "crewneck-sweater", name: "Crewneck Sweater", category: "Sweaters", price: 64.99, rating: 4, image: u("photo-1631541909061-71e349d1f203") },
  { slug: "cardigan", name: "Cardigan", category: "Sweaters", price: 72.99, rating: 4, image: u("photo-1434510423563-c7e99bbc5bbd") },
  { slug: "turtleneck-sweater", name: "Turtleneck Sweater", category: "Sweaters", price: 68.99, rating: 5, image: u("photo-1608217051404-d33fd4db7627") },
  { slug: "cable-knit-sweater", name: "Cable Knit Sweater", category: "Sweaters", price: 79.99, rating: 5, image: u("photo-1638391904459-03e3c5354e9f") },

  // Activewear
  { slug: "running-shorts", name: "Running Shorts", category: "Activewear", price: 39.99, rating: 4, image: u("photo-1519753136092-dad46d3652b1") },
  { slug: "track-pants", name: "Track Pants", category: "Activewear", price: 49.99, rating: 4, image: u("photo-1508985307703-52d13b2b58e4") },
  { slug: "performance-tee", name: "Performance Tee", category: "Activewear", price: 34.99, rating: 4, image: u("photo-1571566882372-1598d88abd90") },
  { slug: "tank-top", name: "Tank Top", category: "Activewear", price: 24.99, rating: 4, image: u("photo-1503341504253-dff4815485f1") },

  // Formal Wear
  { slug: "suit-jacket", name: "Suit Jacket", category: "Formal Wear", price: 229.99, rating: 5, image: u("photo-1507679799987-c73779587ccf") },
  { slug: "dress-shirt", name: "Dress Shirt", category: "Formal Wear", price: 59.99, rating: 4, image: u("photo-1603252109303-2751441dd157") },
  { slug: "dress-trousers", name: "Dress Trousers", category: "Formal Wear", price: 89.99, rating: 4, image: u("photo-1594938298603-c8148c4dae35") },
  { slug: "silk-tie", name: "Silk Tie", category: "Formal Wear", price: 29.99, rating: 4, image: u("photo-1578966356907-e9013ad1b0f3") },

  // ==== Expanded dark-themed catalogue ====
  // Socks
  { slug: "midnight-crew-socks", name: "Midnight Crew Socks", category: "Socks", price: 12.99, rating: 4, image: u("photo-1586350977771-b3b0abd50c82") },
  { slug: "onyx-ankle-socks", name: "Onyx Ankle Socks", category: "Socks", price: 9.99, rating: 4, image: u("photo-1618354691229-88d47f285158") },
  { slug: "shadow-wool-socks", name: "Shadow Wool Socks", category: "Socks", price: 16.99, rating: 5, image: u("photo-1607345366928-199ea26cfe3e") },
  { slug: "carbon-sport-socks", name: "Carbon Sport Socks", category: "Socks", price: 14.99, rating: 4, image: u("photo-1622445275576-721325763afe") },
  { slug: "raven-ribbed-socks", name: "Raven Ribbed Socks", category: "Socks", price: 11.99, rating: 4, image: u("photo-1611072172377-0cabc3addb30") },
  { slug: "eclipse-no-show-socks", name: "Eclipse No-Show Socks", category: "Socks", price: 8.99, rating: 4, image: u("photo-1614676471928-2ed0ad1061a4") },
  { slug: "phantom-compression-socks", name: "Phantom Compression Socks", category: "Socks", price: 18.99, rating: 5, image: u("photo-1622290291468-a28f7a7dc6a8") },
  { slug: "noir-cushion-socks", name: "Noir Cushion Socks", category: "Socks", price: 13.99, rating: 4, image: u("photo-1588850561407-ed78c282e89b") },

  // T-Shirts
  { slug: "obsidian-oversized-tee", name: "Obsidian Oversized Tee", category: "T-Shirts", price: 36.99, rating: 5, image: u("photo-1521572163474-6864f9cf17ab") },
  { slug: "shadow-boxy-tee", name: "Shadow Boxy Tee", category: "T-Shirts", price: 33.99, rating: 4, image: u("photo-1583743814966-8936f5b7be1a") },
  { slug: "carbon-essential-tee", name: "Carbon Essential Tee", category: "T-Shirts", price: 26.99, rating: 4, image: u("photo-1576566588028-4147f3842f27") },
  { slug: "void-graphic-tee", name: "Void Graphic Tee", category: "T-Shirts", price: 38.99, rating: 5, image: u("photo-1503342394128-c104d54dba01") },
  { slug: "ink-longline-tee", name: "Ink Longline Tee", category: "T-Shirts", price: 34.99, rating: 4, image: u("photo-1503341504253-dff4815485f1") },
  { slug: "ash-relaxed-tee", name: "Ash Relaxed Tee", category: "T-Shirts", price: 29.99, rating: 4, image: u("photo-1586350977771-b3b0abd50c82") },
  { slug: "jet-henley-tee", name: "Jet Henley Tee", category: "T-Shirts", price: 39.99, rating: 4, image: u("photo-1571566882372-1598d88abd90") },
  { slug: "coal-acid-wash-tee", name: "Coal Acid Wash Tee", category: "T-Shirts", price: 35.99, rating: 5, image: u("photo-1622445275576-721325763afe") },

  // Shirts
  { slug: "midnight-oxford-shirt", name: "Midnight Oxford Shirt", category: "Shirts", price: 58.99, rating: 5, image: u("photo-1603252109303-2751441dd157") },
  { slug: "raven-flannel-shirt", name: "Raven Flannel Shirt", category: "Shirts", price: 62.99, rating: 4, image: u("photo-1618354691373-d851c5c3a990") },
  { slug: "onyx-overshirt", name: "Onyx Overshirt", category: "Shirts", price: 74.99, rating: 5, image: u("photo-1601333144130-8cbb312386b6") },
  { slug: "charcoal-utility-shirt", name: "Charcoal Utility Shirt", category: "Shirts", price: 69.99, rating: 4, image: u("photo-1620916566398-39f1143ab7be") },
  { slug: "noir-cuban-collar-shirt", name: "Noir Cuban Collar Shirt", category: "Shirts", price: 54.99, rating: 4, image: u("photo-1607345366928-199ea26cfe3e") },
  { slug: "smoke-denim-shirt", name: "Smoke Denim Shirt", category: "Shirts", price: 59.99, rating: 4, image: u("photo-1611312449408-fcece27cdbb7") },
  { slug: "slate-corduroy-shirt", name: "Slate Corduroy Shirt", category: "Shirts", price: 64.99, rating: 4, image: u("photo-1589810635657-232948472d98") },
  { slug: "phantom-grandad-shirt", name: "Phantom Grandad Shirt", category: "Shirts", price: 56.99, rating: 4, image: u("photo-1618354691229-88d47f285158") },

  // Jeans
  { slug: "obsidian-slim-jeans", name: "Obsidian Slim Jeans", category: "Jeans", price: 82.99, rating: 5, image: u("photo-1475178626620-a4d074967452") },
  { slug: "void-tapered-jeans", name: "Void Tapered Jeans", category: "Jeans", price: 86.99, rating: 4, image: u("photo-1542272604-787c3835535d") },
  { slug: "shadow-baggy-jeans", name: "Shadow Baggy Jeans", category: "Jeans", price: 89.99, rating: 4, image: u("photo-1582552938357-32b906df40cb") },
  { slug: "carbon-stacked-jeans", name: "Carbon Stacked Jeans", category: "Jeans", price: 94.99, rating: 5, image: u("photo-1541099649105-f69ad21f3246") },
  { slug: "jet-rigid-jeans", name: "Jet Rigid Jeans", category: "Jeans", price: 88.99, rating: 4, image: u("photo-1591195853828-11db59a44f6b") },
  { slug: "ash-relaxed-jeans", name: "Ash Relaxed Jeans", category: "Jeans", price: 79.99, rating: 4, image: u("photo-1556306535-0f09a537f0a3") },
  { slug: "coal-skinny-jeans", name: "Coal Skinny Jeans", category: "Jeans", price: 77.99, rating: 4, image: u("photo-1542060748-10c28b62716f") },

  // Pants
  { slug: "midnight-cargo-pants", name: "Midnight Cargo Pants", category: "Pants", price: 78.99, rating: 5, image: u("photo-1517438476312-10d79c077509") },
  { slug: "onyx-pleated-trousers", name: "Onyx Pleated Trousers", category: "Pants", price: 84.99, rating: 4, image: u("photo-1594938298603-c8148c4dae35") },
  { slug: "shadow-parachute-pants", name: "Shadow Parachute Pants", category: "Pants", price: 89.99, rating: 5, image: u("photo-1508985307703-52d13b2b58e4") },
  { slug: "carbon-tech-pants", name: "Carbon Tech Pants", category: "Pants", price: 92.99, rating: 5, image: u("photo-1593032465175-481ac7f401a0") },
  { slug: "raven-wide-trousers", name: "Raven Wide Trousers", category: "Pants", price: 74.99, rating: 4, image: u("photo-1519753136092-dad46d3652b1") },
  { slug: "charcoal-chinos", name: "Charcoal Chinos", category: "Pants", price: 67.99, rating: 4, image: u("photo-1602810318383-e386cc2a3ccf") },
  { slug: "storm-utility-pants", name: "Storm Utility Pants", category: "Pants", price: 81.99, rating: 4, image: u("photo-1620231150904-a86b9802656a") },

  // Jackets
  { slug: "obsidian-leather-jacket", name: "Obsidian Leather Jacket", category: "Jackets", price: 219.99, rating: 5, image: u("photo-1551028719-00167b16eac5") },
  { slug: "void-bomber-jacket", name: "Void Bomber Jacket", category: "Jackets", price: 139.99, rating: 5, image: u("photo-1591047139829-d91aecb6caea") },
  { slug: "shadow-trucker-jacket", name: "Shadow Trucker Jacket", category: "Jackets", price: 124.99, rating: 4, image: u("photo-1547063364-caf7d0be2d48") },
  { slug: "phantom-puffer-jacket", name: "Phantom Puffer Jacket", category: "Jackets", price: 164.99, rating: 5, image: u("photo-1523205771623-e0faa4d2813d") },
  { slug: "carbon-moto-jacket", name: "Carbon Moto Jacket", category: "Jackets", price: 209.99, rating: 5, image: u("photo-1620799139507-2a76f79a2f4d") },
  { slug: "raven-coach-jacket", name: "Raven Coach Jacket", category: "Jackets", price: 114.99, rating: 4, image: u("photo-1551537482-f2075a1d41f2") },
  { slug: "ash-denim-jacket", name: "Ash Denim Jacket", category: "Jackets", price: 119.99, rating: 4, image: u("photo-1576871337622-98d48d1cf531") },
  { slug: "nightfall-harrington-jacket", name: "Nightfall Harrington Jacket", category: "Jackets", price: 129.99, rating: 4, image: u("photo-1473966968600-fa801b869a1a") },

  // Coats
  { slug: "midnight-trench-coat", name: "Midnight Trench Coat", category: "Coats", price: 199.99, rating: 5, image: u("photo-1507679799987-c73779587ccf") },
  { slug: "onyx-overcoat", name: "Onyx Overcoat", category: "Coats", price: 219.99, rating: 5, image: u("photo-1591047139829-d91aecb6caea") },
  { slug: "shadow-wool-coat", name: "Shadow Wool Coat", category: "Coats", price: 209.99, rating: 5, image: u("photo-1551028719-00167b16eac5") },
  { slug: "phantom-parka", name: "Phantom Parka", category: "Coats", price: 189.99, rating: 4, image: u("photo-1611312449408-fcece27cdbb7") },
  { slug: "storm-mac-coat", name: "Storm Mac Coat", category: "Coats", price: 174.99, rating: 4, image: u("photo-1620799139507-2a76f79a2f4d") },
  { slug: "eclipse-longline-coat", name: "Eclipse Longline Coat", category: "Coats", price: 229.99, rating: 5, image: u("photo-1576871337622-98d48d1cf531") },

  // Hoodies
  { slug: "obsidian-pullover-hoodie", name: "Obsidian Pullover Hoodie", category: "Hoodies", price: 68.99, rating: 5, image: u("photo-1620799140408-edc6dcb6d633") },
  { slug: "void-zip-hoodie", name: "Void Zip Hoodie", category: "Hoodies", price: 72.99, rating: 5, image: u("photo-1515886657613-9f3515b0c78f") },
  { slug: "shadow-heavyweight-hoodie", name: "Shadow Heavyweight Hoodie", category: "Hoodies", price: 84.99, rating: 5, image: u("photo-1556821840-3a63f95609a7") },
  { slug: "carbon-tech-hoodie", name: "Carbon Tech Hoodie", category: "Hoodies", price: 89.99, rating: 5, image: u("photo-1620799140188-3b2a02fd9a77") },
  { slug: "raven-cropped-hoodie", name: "Raven Cropped Hoodie", category: "Hoodies", price: 58.99, rating: 4, image: u("photo-1620231150904-a86b9802656a") },
  { slug: "ash-oversized-hoodie", name: "Ash Oversized Hoodie", category: "Hoodies", price: 74.99, rating: 5, image: u("photo-1576995853123-5a10305d93c0") },
  { slug: "jet-sherpa-hoodie", name: "Jet Sherpa Hoodie", category: "Hoodies", price: 79.99, rating: 4, image: u("photo-1556905055-8f358a7a47b2") },
  { slug: "coal-graphic-hoodie", name: "Coal Graphic Hoodie", category: "Hoodies", price: 64.99, rating: 4, image: u("photo-1593032465175-481ac7f401a0") },

  // Sweaters
  { slug: "midnight-knit-sweater", name: "Midnight Knit Sweater", category: "Sweaters", price: 72.99, rating: 5, image: u("photo-1631541909061-71e349d1f203") },
  { slug: "onyx-turtleneck-sweater", name: "Onyx Turtleneck Sweater", category: "Sweaters", price: 78.99, rating: 5, image: u("photo-1608217051404-d33fd4db7627") },
  { slug: "shadow-cardigan", name: "Shadow Cardigan", category: "Sweaters", price: 76.99, rating: 4, image: u("photo-1434510423563-c7e99bbc5bbd") },
  { slug: "carbon-cable-knit", name: "Carbon Cable Knit", category: "Sweaters", price: 84.99, rating: 5, image: u("photo-1638391904459-03e3c5354e9f") },
  { slug: "raven-mockneck-sweater", name: "Raven Mockneck Sweater", category: "Sweaters", price: 69.99, rating: 4, image: u("photo-1576995853123-5a10305d93c0") },
  { slug: "charcoal-merino-sweater", name: "Charcoal Merino Sweater", category: "Sweaters", price: 94.99, rating: 5, image: u("photo-1601924994987-69e26d50dc26") },
  { slug: "smoke-quarter-zip-sweater", name: "Smoke Quarter-Zip Sweater", category: "Sweaters", price: 74.99, rating: 4, image: u("photo-1620336655055-088d06e36bf0") },

  // Activewear
  { slug: "obsidian-training-tee", name: "Obsidian Training Tee", category: "Activewear", price: 36.99, rating: 4, image: u("photo-1571566882372-1598d88abd90") },
  { slug: "void-running-shorts", name: "Void Running Shorts", category: "Activewear", price: 42.99, rating: 4, image: u("photo-1519753136092-dad46d3652b1") },
  { slug: "shadow-track-pants", name: "Shadow Track Pants", category: "Activewear", price: 54.99, rating: 5, image: u("photo-1508985307703-52d13b2b58e4") },
  { slug: "carbon-compression-tee", name: "Carbon Compression Tee", category: "Activewear", price: 44.99, rating: 5, image: u("photo-1593032465175-481ac7f401a0") },
  { slug: "phantom-windbreaker-set", name: "Phantom Windbreaker Set", category: "Activewear", price: 109.99, rating: 5, image: u("photo-1602810318383-e386cc2a3ccf") },
  { slug: "ash-seamless-leggings", name: "Ash Seamless Leggings", category: "Activewear", price: 49.99, rating: 4, image: u("photo-1556306535-0f09a537f0a3") },
  { slug: "storm-performance-shorts", name: "Storm Performance Shorts", category: "Activewear", price: 39.99, rating: 4, image: u("photo-1591195853828-11db59a44f6b") },

  // Formal Wear
  { slug: "midnight-tuxedo-jacket", name: "Midnight Tuxedo Jacket", category: "Formal Wear", price: 259.99, rating: 5, image: u("photo-1507679799987-c73779587ccf") },
  { slug: "onyx-dress-shirt", name: "Onyx Dress Shirt", category: "Formal Wear", price: 64.99, rating: 5, image: u("photo-1603252109303-2751441dd157") },
  { slug: "shadow-suit-trousers", name: "Shadow Suit Trousers", category: "Formal Wear", price: 99.99, rating: 4, image: u("photo-1594938298603-c8148c4dae35") },
  { slug: "noir-waistcoat", name: "Noir Waistcoat", category: "Formal Wear", price: 89.99, rating: 4, image: u("photo-1589810635657-232948472d98") },
  { slug: "phantom-bow-tie", name: "Phantom Bow Tie", category: "Formal Wear", price: 24.99, rating: 4, image: u("photo-1578966356907-e9013ad1b0f3") },
  { slug: "slate-silk-tie", name: "Slate Silk Tie", category: "Formal Wear", price: 32.99, rating: 4, image: u("photo-1620916566398-39f1143ab7be") },

  // Shorts
  { slug: "obsidian-cargo-shorts", name: "Obsidian Cargo Shorts", category: "Shorts", price: 49.99, rating: 4, image: u("photo-1591195853828-11db59a44f6b") },
  { slug: "void-denim-shorts", name: "Void Denim Shorts", category: "Shorts", price: 54.99, rating: 4, image: u("photo-1556306535-0f09a537f0a3") },
  { slug: "shadow-chino-shorts", name: "Shadow Chino Shorts", category: "Shorts", price: 44.99, rating: 4, image: u("photo-1542060748-10c28b62716f") },
  { slug: "carbon-sweat-shorts", name: "Carbon Sweat Shorts", category: "Shorts", price: 39.99, rating: 4, image: u("photo-1593032465175-481ac7f401a0") },
  { slug: "raven-tech-shorts", name: "Raven Tech Shorts", category: "Shorts", price: 47.99, rating: 5, image: u("photo-1519753136092-dad46d3652b1") },
  { slug: "jet-linen-shorts", name: "Jet Linen Shorts", category: "Shorts", price: 42.99, rating: 4, image: u("photo-1602810318383-e386cc2a3ccf") },

  // Accessories
  { slug: "midnight-beanie", name: "Midnight Beanie", category: "Accessories", price: 24.99, rating: 5, image: u("photo-1556905055-8f358a7a47b2") },
  { slug: "onyx-cap", name: "Onyx Cap", category: "Accessories", price: 27.99, rating: 4, image: u("photo-1542219550-37153d387c27") },
  { slug: "shadow-bucket-hat", name: "Shadow Bucket Hat", category: "Accessories", price: 29.99, rating: 4, image: u("photo-1517466787929-bc90951d0974") },
  { slug: "carbon-scarf", name: "Carbon Scarf", category: "Accessories", price: 34.99, rating: 4, image: u("photo-1581655353564-df123a1eb820") },
  { slug: "raven-leather-belt", name: "Raven Leather Belt", category: "Accessories", price: 39.99, rating: 5, image: u("photo-1601924994987-69e26d50dc26") },
  { slug: "phantom-gloves", name: "Phantom Gloves", category: "Accessories", price: 32.99, rating: 4, image: u("photo-1620336655055-088d06e36bf0") },
  { slug: "eclipse-sunglasses", name: "Eclipse Sunglasses", category: "Accessories", price: 59.99, rating: 5, image: u("photo-1556306535-38febf6782e7") },
  { slug: "storm-backpack", name: "Storm Backpack", category: "Accessories", price: 79.99, rating: 5, image: u("photo-1521119989659-a83eee488004") },
  { slug: "noir-crossbody-bag", name: "Noir Crossbody Bag", category: "Accessories", price: 64.99, rating: 4, image: u("photo-1606107557195-0e29a4b5b4aa") },
  { slug: "jet-leather-wallet", name: "Jet Leather Wallet", category: "Accessories", price: 44.99, rating: 5, image: u("photo-1564859228273-274232fdb516") },

  // Underwear
  { slug: "obsidian-boxer-briefs", name: "Obsidian Boxer Briefs", category: "Underwear", price: 19.99, rating: 4, image: u("photo-1556306535-0f09a537f0a3") },
  { slug: "void-trunks", name: "Void Trunks", category: "Underwear", price: 21.99, rating: 4, image: u("photo-1591195853828-11db59a44f6b") },
  { slug: "shadow-undershirt", name: "Shadow Undershirt", category: "Underwear", price: 17.99, rating: 4, image: u("photo-1586350977771-b3b0abd50c82") },
  { slug: "carbon-brief-pack", name: "Carbon Brief 3-Pack", category: "Underwear", price: 29.99, rating: 5, image: u("photo-1622445275576-721325763afe") },
  { slug: "raven-thermal-base-layer", name: "Raven Thermal Base Layer", category: "Underwear", price: 34.99, rating: 5, image: u("photo-1576995853123-5a10305d93c0") },

  // Loungewear
  { slug: "midnight-lounge-set", name: "Midnight Lounge Set", category: "Loungewear", price: 79.99, rating: 5, image: u("photo-1620799140188-3b2a02fd9a77") },
  { slug: "onyx-sweatpants", name: "Onyx Sweatpants", category: "Loungewear", price: 54.99, rating: 4, image: u("photo-1576995853123-5a10305d93c0") },
  { slug: "shadow-robe", name: "Shadow Robe", category: "Loungewear", price: 64.99, rating: 4, image: u("photo-1551489186-cf8726f514f8") },
  { slug: "carbon-pajama-set", name: "Carbon Pajama Set", category: "Loungewear", price: 59.99, rating: 4, image: u("photo-1556905055-8f358a7a47b2") },
  { slug: "raven-thermal-henley", name: "Raven Thermal Henley", category: "Loungewear", price: 49.99, rating: 4, image: u("photo-1620231150904-a86b9802656a") },

  // Low-value item for verifying live payments end-to-end. Hide it from the
  // storefront via Admin → Products once you're done testing.
  { slug: "payment-test-item", name: "Payment Test Item", category: "Test", price: 1, rating: 5, image: u("photo-1556905055-8f358a7a47b2") },
]

export const featuredProducts = shopProducts.filter((p) => p.featured)

export const categories = Array.from(new Set(shopProducts.map((p) => p.category)))

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return shopProducts.find((p) => p.slug === slug)
}

export function getRelatedProducts(slug: string, limit = 4): ShopProduct[] {
  const product = getProductBySlug(slug)
  if (!product) return shopProducts.slice(0, limit)
  const sameCategory = shopProducts.filter((p) => p.category === product.category && p.slug !== slug)
  const others = shopProducts.filter((p) => p.category !== product.category && p.slug !== slug)
  return [...sameCategory, ...others].slice(0, limit)
}

export function searchProducts(query: string): ShopProduct[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []
  // Every term must appear somewhere in the name or category, so multi-word
  // queries like "black jeans" narrow results instead of matching either word.
  return shopProducts.filter((p) => {
    const haystack = `${p.name} ${p.category}`.toLowerCase()
    return terms.every((t) => haystack.includes(t))
  })
}
