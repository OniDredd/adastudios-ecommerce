import SaleBanner from "@/components/Homepage/Banner";
import BrandDescription from "@/components/Homepage/BrandDescription";
import InstagramFeed from "@/components/Homepage/InstagramPosts";
import NewArrivals from "@/components/Homepage/NewArrivals";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <SaleBanner />
      <NewArrivals />
      <BrandDescription />
      <InstagramFeed />
    </main>
  );
}
