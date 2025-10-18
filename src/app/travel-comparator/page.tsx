import Footer from "@/components/Footer";
import Hero from "./components/Hero";
import OurListings from "./components/OurListings";
import { TopNavBar } from "@/components/TopNav";
import ActionBox from "./components/ActionBox";

const CompareListing = () => {
  return (
    <>
      <TopNavBar />
      <main className="pt-12 md:pt-16 bg-white dark:bg-[#222529]">
        <Hero />
        <OurListings />
      </main>
      <Footer />
    </>
  );
};

export default CompareListing;