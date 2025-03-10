"use client";

import { UserTable } from "@/app/(app)/users/columns";
import { PaginationDemo } from "@/components/pagination/pagination";
import { useCrud } from '@/hooks/useCrud';
import {DialogDemo} from "@/components/popup/dialogDemo";

export default function Page() {
  const {
    data,
    error,
    isLoading,
    deleteItem,
    currentPage,
    setCurrentPage,
    totalPages
  } = useCrud('users');
const buttonTitle = '+'

  return (
    <div>
      <h2>List of Users</h2>
      <br />
      {/* <button className="ml-5" onClick={DialogDemo}>+</button> */}
      <DialogDemo buttonTitle={buttonTitle}/>
      <br />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <UserTable data={data} onDelete={deleteItem} />
          <div className="mt-2 flex justify-center">
            <PaginationDemo
              currentPage={currentPage}
              setPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
      {error && (
        <div className="text-red-500 mt-2">
          Error: {error.message}
        </div>
      )}
    </div>
  );
}
