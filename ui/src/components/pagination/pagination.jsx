import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

export default function PaginationComponent({ currentPage, totalPages, setCurrentPage }) {
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

            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
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