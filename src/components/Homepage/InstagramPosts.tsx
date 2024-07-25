// components/InstagramFeed.tsx
import Link from "next/link";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";

interface InstagramPost {
  id: number;
  imageUrl: string;
  title: string;
  link: string;
}

const instagramPosts: InstagramPost[] = [
  { id: 1, imageUrl: "/instagram-1.jpg", title: "HELLO MONDAY", link: "https://www.instagram.com/p/post1" },
  { id: 2, imageUrl: "/instagram-2.jpg", title: "Product Showcase", link: "https://www.instagram.com/p/post2" },
  { id: 3, imageUrl: "/instagram-3.jpg", title: "Custom Design", link: "https://www.instagram.com/p/post3" },
  { id: 4, imageUrl: "/instagram-4.jpg", title: "Workspace Inspiration", link: "https://www.instagram.com/p/post4" },
  { id: 5, imageUrl: "/instagram-5.jpg", title: "Thank You 214,000", link: "https://www.instagram.com/p/post5" },
  { id: 6, imageUrl: "/instagram-6.jpg", title: "Coffee Break", link: "https://www.instagram.com/p/post6" },
  { id: 7, imageUrl: "/instagram-7.jpg", title: "About Us", link: "https://www.instagram.com/p/post7" },
  { id: 8, imageUrl: "/instagram-8.jpg", title: "City View", link: "https://www.instagram.com/p/post8" },
];

const InstagramFeed: React.FC = () => {
  return (
    <section className="w-full py-16 font-main-font uppercase">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Follow Us on Instagram</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramPosts.map((post) => (
            <Link
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden group"
            >
              <Image
                src={post.imageUrl}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                className="w-full h-full transition-transform duration-300 group-hover:scale-110 bg-zinc-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-center font-semibold">{post.title}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="https://www.instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors duration-300"
          >
            <FaInstagram className="mr-2" />
            Follow @yourusername
          </Link>
        </div>
      </div>
    </section>
  );
}

export default InstagramFeed;