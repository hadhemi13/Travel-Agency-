export default Hero;
import Footer from "@/components/Footer";
import { TopNavBar } from "@/components/TopNav";
import OurListings from "./[id]/components/OurListings";
import Hero from "@/components/home/Hero";
const CompareListing = async () => {
  return (
    <>
      {" "}
      <TopNavBar />{" "}
      <main className="pt-12 md:pt-16 bg-white dark:bg-[#222529]">
        {" "}
        <Hero /> <OurListings />{" "}
      </main>{" "}
      <Footer />{" "}
    </>
  );
};
