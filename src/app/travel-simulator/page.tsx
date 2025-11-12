import Footer from "@/components/Footer";
import TravelSimulator from "@/components/simulator/TravelSimulator";
import { TopNavBar } from "@/components/TopNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
        <TopNavBar/>
      <TravelSimulator />
<Footer/>
    </main>
  );
}