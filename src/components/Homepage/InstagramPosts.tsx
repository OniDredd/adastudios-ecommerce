// components/InstagramFeed.js
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";

const instagramPosts = [
  { id: 1, imageUrl: "/instagram-1.jpg", likes: 123, comments: 45 },
  { id: 2, imageUrl: "/instagram-2.jpg", likes: 234, comments: 56 },
  { id: 3, imageUrl: "/instagram-3.jpg", likes: 345, comments: 67 },
  { id: 4, imageUrl: "/instagram-4.jpg", likes: 456, comments: 78 },
  { id: 5, imageUrl: "/instagram-5.jpg", likes: 567, comments: 89 },
  { id: 6, imageUrl: "/instagram-6.jpg", likes: 678, comments: 90 },
];

export default function InstagramFeed() {
  return (
    <section className="py-16">
      <div className="mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Follow Us on Instagram
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <div key={post.id} className="relative group">
              <Image
                src={post.imageUrl}
                alt={`Instagram post ${post.id}`}
                width={300}
                height={300}
                className="w-full h-auto bg-gray-600"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-white text-center">
                  <p>{post.likes} likes</p>
                  <p>{post.comments} comments</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors duration-300"
          >
            <FaInstagram className="mr-2" />
            Follow @yourusername
          </a>
        </div>
      </div>
    </section>
  );
}
