import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/smooth-scroll";
import { AppProvider } from "@/context/app-context";
import AmbientSound from "@/components/ui/ambient-sound";
import PromoPopup from "@/components/ui/promo-popup";
import AnimatedWidgets from "@/components/ui/animated-widgets";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Velvet Roast | Luxury Café & Artisanal Roastery",
  description:
    "Experience handcrafted specialty coffee, fresh pastries, and cinematic atmosphere in the heart of the city. Award-winning luxury beverage concept inspired by modern cinematic design.",
  keywords: ["Luxury Cafe", "Velvet Roast", "Specialty Coffee", "Artisan Roastery", "High-End Coffee Shop"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#0F0F0F] text-[#F6F2EC] selection:bg-[#C49A6C] selection:text-[#0F0F0F]">
        <AppProvider>
          <SmoothScrollProvider>
            <AnimatedWidgets />
            {children}
            <PromoPopup />
            <AmbientSound />
          </SmoothScrollProvider>
        </AppProvider>
      </body>
    </html>
  );
}
