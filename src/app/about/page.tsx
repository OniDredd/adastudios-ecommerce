import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-32 font-main-font">
      <h1 className="text-3xl font-bold text-center">About us</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <p className="mb-4">
              Ive always been called the stylist in my family and among
              friends.
            </p>
            <p className="mb-4">
              I think back to when I was a kid rummaging through my moms closet
              and eventually convincing her that a pair of boots with heels was
              necessary for my outfit. They were brown, and the heel was barely
              there. I was obsessed with them. I think my dream to own a
              clothing brand started somewhere around that time, and since then,
              it has been something I have worked towards.
            </p>
            <p className="mb-4">
              Before I knew anything about the brand, I knew I wanted to produce
              in Portugal. Ethical production is the only way I know, and I knew
              it then as well. Today, were producing in Italy and Sweden too.
            </p>
            {/* Add more paragraphs as needed */}
            <p className="mb-4">
              Love,
              <br />
              Markela &lt;3
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/path-to-your-image.jpg"
              alt="Founders of the company"
              width={500}
              height={600}
              className="w-full h-auto bg-zinc-700"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src="/path-to-image-1.jpg"
            alt="Designer working"
            width={500}
            height={600}
            className="w-full h-auto bg-zinc-700"
          />
        </div>
        <div>
          <Image
            src="/path-to-image-2.jpg"
            alt="Clothing rack"
            width={500}
            height={600}
            className="w-full h-auto bg-zinc-700"
          />
        </div>
      </section>
    </div>
  );
}
