import Link from "next/link";

// components/BrandDescription.js
export default function BrandDescription() {
  return (
    <section className="px-6 py-20 md:p-32 text-center border-t-[1px] border-main-maroon">
      <p className="mb-6 md:mb-10 text-base md:text-xl text-main-maroon">
        Ada Studio brings timeless design to your home, offering premium
        glassware and authentic Japanese matcha. Our mission is to inspire a
        better home café experience and create a lifestyle of elegance, comfort,
        and sustainability. Elevate your daily rituals with pieces designed to
        transform your space into a haven of style and taste.
      </p>
      <Link href="about">
        <button className="text-main-maroon border-[1px] border-main-maroon hover:bg-main-maroon hover:text-secondary -peach duration-200 px-10 py-4 rounded-full">
          EXPLORE ADA STUDIO
        </button>
      </Link>
    </section>
  );
}
