import FeaturesSection from "@/components/pages/feature-section"
import FooterServices from "@/components/pages/footer"
import HeroSectionWithReviews from "@/components/pages/hero-section"
import ProductGrid from "@/components/pages/listitem"
import Navbar from "@/components/pages/navbar"
import BestsellerSection from "@/components/pages/bestseller"

export default function Home() {
  return (
    <main className="min-h-screen bg-black w-full">
      <Navbar />
      <HeroSectionWithReviews />
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-32">
          <BestsellerSection />
          <FeaturesSection />
          <ProductGrid />
          <FooterServices />
        </div>
      </div>
    </main>
  )
}

