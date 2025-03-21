import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
  } from "@/components/ui/pagination"

export default function PaginationComponent({ currentPage, totalPages, setCurrentPage }) {
  // Function to generate the page numbers to display
  const getPageNumbers = () => {
    const maxPagesToShow = 5; // Maximum number of page numbers to show
    
    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than the max, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always include first and last page
    const firstPage = 1;
    const lastPage = totalPages;
    
    // Calculate the range around the current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust if we're near the beginning or end
    if (currentPage <= 3) {
      // Near the beginning, show more pages at the start
      endPage = Math.min(maxPagesToShow - 1, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      // Near the end, show more pages at the end
      startPage = Math.max(2, totalPages - (maxPagesToShow - 2));
    }
    
    // Build the array of page numbers with ellipsis indicators
    const pages = [firstPage];
    
    // Add ellipsis if there's a gap after the first page
    if (startPage > 2) {
      pages.push('ellipsis-start');
    }
    
    // Add the range of pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if there's a gap before the last page
    if (endPage < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    
    // Add the last page if it's not already included
    if (lastPage !== firstPage) {
      pages.push(lastPage);
    }
    
    return pages;
  };

  return (
    <div className="py-4 flex items-center justify-end">
        <Pagination>
        <PaginationContent>
            <PaginationItem>
            <PaginationPrevious 
                href="#"
                onClick={(e) => {
                e.preventDefault()
                setCurrentPage(prev => Math.max(1, prev - 1))
                }}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            ))}

            <PaginationItem>
            <PaginationNext
                href="#"
                onClick={(e) => {
                e.preventDefault()
                setCurrentPage(prev => Math.min(totalPages, prev + 1))
                }}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
            </PaginationItem>
        </PaginationContent>
        </Pagination>
    </div>
  );
}