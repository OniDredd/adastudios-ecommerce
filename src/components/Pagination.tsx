import { Button } from './ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="text-main-maroon border-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
      >
        Previous
      </Button>
      {[...Array(totalPages)].map((_, index) => (
        <Button
          key={index}
          variant={currentPage === index + 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(index + 1)}
          className={currentPage === index + 1 
            ? "bg-main-maroon text-secondary-peach hover:bg-main-maroon/90"
            : "text-main-maroon border-main-maroon hover:bg-main-maroon hover:text-secondary-peach"}
        >
          {index + 1}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="text-main-maroon border-main-maroon hover:bg-main-maroon hover:text-secondary-peach transition-colors"
      >
        Next
      </Button>
    </div>
  );
}
