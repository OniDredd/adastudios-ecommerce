// components/NewArrivals.js
import Image from 'next/image';

export default function NewArrivals() {
  const products = [
    { name: 'EDNA SHIRT', price: '$249', image: '/edna-shirt.jpg' },
    { name: 'BUZZ JEAN', price: '$269', image: '/buzz-jean.jpg' },
    { name: 'EMMA KNIT LONG SLEEVE', price: '$169', image: '/emma-knit.jpg' },
    { name: 'PEN PENCIL SKIRT', price: '$179', image: '/pen-pencil-skirt.jpg' },
  ];

  return (
    <section className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-main-font">NEW ARRIVALS</h2>
        <a href="/new-arrivals" className="text-sm">VIEW ALL</a>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product, index) => (
          <div key={index} className="text-center">
            <Image src={product.image} alt={product.name} width={300} height={400} className="mb-2 bg-zinc-600 rounded-xl" />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}