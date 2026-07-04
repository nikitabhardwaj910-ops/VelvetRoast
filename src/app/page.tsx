import Navbar from "@/components/navigation/navbar";
import HeroSection from "@/components/sections/hero";
import ScrollVelocityMarquee from "@/components/sections/scroll-marquee";
import ScrollFloatingElements from "@/components/ui/scroll-floating-elements";
import FeatureStrip from "@/components/sections/feature-strip";
import AboutPreview from "@/components/sections/about-preview";
import FeaturedMenu from "@/components/sections/featured-menu";
import GalleryPreview from "@/components/sections/gallery-preview";
import ReviewsPreview from "@/components/sections/reviews-preview";
import ReservationCTA from "@/components/sections/reservation-cta";
import NewsletterSection from "@/components/sections/newsletter";
import Footer from "@/components/navigation/footer";
import GlobalModals from "@/components/ui/modals";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden">
      <ScrollFloatingElements />
      <Navbar />
      <HeroSection />
      <ScrollVelocityMarquee />
      <FeatureStrip />
      <AboutPreview />
      <FeaturedMenu />
      <GalleryPreview />
      <ReviewsPreview />
      <ReservationCTA />
      <NewsletterSection />
      <Footer />
      <GlobalModals />
    </main>
  );
}
