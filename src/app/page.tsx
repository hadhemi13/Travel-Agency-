import Footer from "@/components/Footer";
import FeaturedHotels from "@/components/home/FeaturedHotels";
import Hero from "@/components/home/Hero";
import { TopNavBar } from "@/components/TopNav";

export default function HomePage() {
  return (
    <>
      <TopNavBar />
      <main className="min-h-screen bg-gray-950 dark:bg-gray-900 pt-16">
        <Hero />
        <FeaturedHotels />
      <Footer/>
      </main>
    </>
  );
}