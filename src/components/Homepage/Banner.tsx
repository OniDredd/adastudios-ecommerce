// components/SaleBanner.js
export default function SaleBanner() {
    return (
      <section className="w-full h-[70vh] flex flex-col justify-center items-center bg-green-700 text-center py-20">
        <h1 className="text-6xl font-bold text-white">SALE</h1>
        <p className="text-2xl text-white">UP TO 50% OFF</p>
        <p className="text-sm text-white mt-2">SHOP FINAL REDUCTIONS</p>
      </section>
    );
  }