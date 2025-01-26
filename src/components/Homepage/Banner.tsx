import { FadeIn } from "@/components/ui/fade-in";
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
});

export default function SaleBanner() {
    return (
      <section className="w-full h-screen flex flex-col justify-end items-center bg-[url('/HeroBackground.png')] bg-cover bg-center md:bg-top text-center pb-16 border-main-maroon border-b-[1px]">
        <FadeIn className="space-y-3">
          <h1 className={`${inter.className} text-lg lg:text-3xl font-regular text-main-maroon`}>
            New Year, New Look, Same glassware you love.
          </h1>
        </FadeIn>
      </section>
    );
  }
