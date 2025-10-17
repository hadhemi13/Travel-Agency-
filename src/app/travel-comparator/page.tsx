
import Footer from "@/components/Footer";
import Hero from "./components/Hero";
import OurListings from "./components/OurListings";
import { TopNavBar } from "@/components/TopNav";
import ActionBox from "./components/ActionBox";

const CompareListing = () => {
  return (
    <>
      <TopNavBar />
      <main>
        <Hero />
        <OurListings />
        <ActionBox />
      </main>
      <Footer />
    </>
  );
};

export default CompareListing;
