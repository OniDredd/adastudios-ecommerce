export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-peach">
      <div className="relative w-32 h-32">
        <img 
          src="/adastudioslogo-peach.svg"
          alt="Ada Studios Logo"
          className="w-full h-full object-contain animate-fade"
        />
      </div>
    </div>
  );
}
