export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-peach">
      <div className="relative">
        {/* Loading spinner */}
        <div className="w-16 h-16 border-4 border-main-maroon/20 border-t-main-maroon rounded-full animate-spin" />
        
        {/* Loading text */}
        <div className="mt-4 text-center">
          <p className="text-main-maroon font-medium">Loading</p>
          <div className="flex justify-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 bg-main-maroon rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-main-maroon rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-main-maroon rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
