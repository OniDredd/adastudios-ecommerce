import Image from "next/image";

const products = [
  {
    name: "EDDIE SHIRT",
    price: 249,
    colors: ["blue", "pink"],
    image: "/eddie-shirt.jpg",
  },
  {
    name: "JOSIE SWEATER",
    price: 329,
    colors: ["red", "beige"],
    image: "/josie-sweater.jpg",
  },
  {
    name: "KENDALL SATIN DRESS",
    price: 329,
    colors: ["red", "black", "blue"],
    image: "/kendall-dress.jpg",
  },
  {
    name: "CLOVER JEAN",
    price: 269,
    colors: ["blue"],
    image: "/clover-jean.jpg",
  },
  {
    name: "SONNY QUILT JACKET",
    price: 349,
    colors: ["beige", "blue"],
    image: "/sonny-jacket.jpg",
  },
  {
    name: "FIREBIRD COWL GOWN",
    price: 389,
    colors: ["red", "green", "blue"],
    image: "/firebird-gown.jpg",
  },
  {
    name: "MARGIE TIE-BACK BLOUSE",
    price: 239,
    colors: ["white", "black"],
    image: "/margie-blouse.jpg",
  },
  {
    name: "EMMA CARDIGAN",
    price: 199,
    colors: ["red", "black"],
    image: "/emma-cardigan.jpg",
  },
  {
    name: "MERCI DENIM JEAN",
    price: 269,
    colors: ["red", "blue"],
    image: "/merci-jean.jpg",
  },
  {
    name: "MILLA MERINO LONG SLEEVE",
    price: 209,
    colors: ["white", "green"],
    image: "/milla-sleeve.jpg",
  },
  // Add more products as needed
];

export default function AllClothing() {
  return (
    <main>
      <section className="p-32 bg-main-green text-main-creme">
        <h1 className="text-4xl font-bold mb-4 font-main-font">SALE</h1>

        <div className="flex justify-between items-start mb-8">
          <p className="max-w-md">
            From dresses, tops, and skirts to our signature staple trousers,
            build your dream Rubette wardrobe now...
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index}>
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={400}
                className="w-full h-auto mb-2 bg-zinc-700"
              />
              <h3 className="font-bold">{product.name}</h3>
              <p>${product.price}</p>
              <div className="flex space-x-1 mt-1">
                {product.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className={`w-4 h-4 rounded-full bg-${color}-500`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
