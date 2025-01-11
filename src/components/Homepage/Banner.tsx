// components/SaleBanner.js
export default function SaleBanner() {
    return (
      <section className="w-full h-[100vh] flex flex-col justify-center items-center bg-[url('/HeroBackground.png')] bg-cover bg-center md:bg-top text-center py-12 md:py-20 border-main-maroon border-b-[1px]">
        <h1 className="text-3xl md:text-4xl font-main-font uppercase text-main-peach"></h1>
      </section>
    );
  }
