import FeaturedHotels from "@/components/home/FeaturedHotels";
import Hero from "@/components/home/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <Hero />
      <FeaturedHotels />
    </main>
  );
}