import { FadeIn } from "@/components/ui/fade-in";
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
});

export default function SaleBanner() {
    return (
      <section className="w-full h-screen flex flex-col justify-center lg:justify-start items-center lg:items-start bg-[url('/HeroBackground3.jpg')] bg-cover bg-[60%_center] lg:bg-top text-left px-32 pt-60 border-main-maroon border-b-[1px]">
        {/* <FadeIn className="hidden lg:block space-y-3 max-w-full">
          <h1 className={`${inter.className} text-md lg:text-3xl font-black text-secondary-peach max-w-lg`}>
            Transforming takeaway into a lifestyle statement.
          </h1>
        </FadeIn> */}
      </section>
    );
  }
