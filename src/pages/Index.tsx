import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { CallToAction } from "@/components/CallToAction"
import { Footer } from "@/components/Footer"
import { SocialMeta } from "@/utils/socialMeta"

const Index = () => {
  return (
    <div className="min-h-screen">
      <SocialMeta
        title="Rent Boats & Get Your Skipper License in South Africa"
        description="Find the perfect boat rental and get your SAMSA skipper license. Verified listings, trusted providers, and expert support across South Africa."
        url="/"
        type="website"
      />
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
