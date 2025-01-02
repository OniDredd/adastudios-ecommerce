import Link from "next/link";

// components/BrandDescription.js
export default function BrandDescription() {
  return (
    <section className="p-32 text-center border-t-[1px] border-main-maroon">
      <p className="mb-10 text-xl text-main-maroon">
        ADA STUDIOS is a chic glassware brand made for the modern &quot;that
        girl.&quot; We create gorgeous drinking glasses that turn your everyday
        sips into fabulous moments. Our pieces are designed for everybody who
        love living their best life and making every drink feel special.
      </p>
      <Link href="about">
        <button className="text-main-maroon border-[1px] border-main-maroon hover:bg-main-maroon hover:text-secondary -peach duration-200 px-10 py-4 rounded-full">
          EXPLORE ADA STUDIO
        </button>
      </Link>
    </section>
  );
}
