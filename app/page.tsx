import FeaturesSection from "@/components/pages/feature-section"
import FooterServices from "@/components/pages/footer"
import HeroSectionWithReviews from "@/components/pages/hero-section"
import ProductGrid from "@/components/pages/listitem"
import Navbar from "@/components/pages/navbar"
import BestsellerSection from "@/components/pages/bestseller"

export default function Home() {
  return (
    <div className="h-screen bg-black w-full">
      <Navbar />
      <HeroSectionWithReviews/>
      <br/>
      <br/>
      <br/>
      <div className="space-y-24">
      <BestsellerSection/>
      <FeaturesSection/>
      <ProductGrid/>
      <FooterServices/>
      </div>
    </div>
  )
}

