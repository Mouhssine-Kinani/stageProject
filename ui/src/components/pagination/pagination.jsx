import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  import { useEffect } from "react";
  
  export function PaginationDemo({ currentPage, setCurrentPage, totalPages }) {
    useEffect(() => {
        alert(currentPage + " " +  totalPages + "GGGGGGG////");
    }, [currentPage, totalPages]);
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={() => setCurrentPage(Math.max(1, currentPage - 1)) } />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href="#"
              isActive={currentPage === index + 1}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
          {totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext href="#"onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1)) } />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }
  