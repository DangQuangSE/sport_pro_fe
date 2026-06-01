import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanner from "@/components/home/PromoBanner";
import Footer from "@/components/home/Footer";

// ─── Home Page ───────────────────────────────────────────────────────────────
// Principle: High-fidelity, premium, performance-driven e-commerce experience.
// Asymmetric compositions, spring-physics vibes, and strict typography hierarchy.

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <HeroSection />
        <FeaturedProducts />
        <PromoBanner />
      </main>

      <Footer />
    </div>
  );
}
