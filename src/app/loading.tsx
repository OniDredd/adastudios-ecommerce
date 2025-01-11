import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-peach">
      <div className="relative w-32 h-32">
        <Image 
          src="/adastudioslogo-peach.svg"
          alt="Ada Studios Logo"
          width={128}
          height={128}
          className="object-contain animate-fade"
        />
      </div>
    </div>
  );
}
