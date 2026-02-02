import Header from "@/components/sections/Header";
import HeroBanner from "@/components/sections/HeroBanner";
import ArticlesSection from "@/components/sections/ArticlesSection";
import LatestProductsGallery from "@/components/sections/LatestProductsGallery";
import PopularCategories from "@/components/sections/PopularCategories";
import HomeServicesSection from "@/components/sections/HomeServicesSection";
import Breadcrumbs from "@/components/sections/Breadcrumbs";
import PLPHeader from "@/components/sections/PLPHeaders";
import ProductFilterSidebar from "@/components/sections/ProductFilterSidebar";
import ProductGrid from "@/components/sections/ProductGrid";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <HeroBanner />
        <ArticlesSection />
        <LatestProductsGallery />
        <PopularCategories />
        <HomeServicesSection />
      </main>
      {/* <FloatingCTA /> */}
      <footer className="bg-brand-navy text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-70">
            © 2025 Materio. All rights reserved. Developed by <a href="https://jimmyprogrammer.vercel.app/" className="underline">Jimmy</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
