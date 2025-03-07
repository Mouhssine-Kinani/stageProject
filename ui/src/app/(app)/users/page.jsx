"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { UserTable } from "@/app/(app)/users/columns";
import {PaginationDemo} from "@/components/pagination/pagination";
import {useCrud} from '@/hooks/useCrud'

export default function Page() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages , setTotalPages] = useState(1)
  const itemsPerPage = 5;
  const { deleteItem, error } = useCrud('users');

//   const startIndex = (currentPage - 1) * itemsPerPage
//   const endIndex = startIndex + itemsPerPage
//   const paginateData = data.slice(startIndex, endIndex)

  async function fetchUsers() {
    try {
      const resp = await axios.get(`${process.env.NEXT_PUBLIC_URLAPI}/users?page=${currentPage}&limit=${itemsPerPage}`);
      return resp.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return {users: [], totalPages: 1 };
    }
  }

  useEffect(() => {
    async function fetchData() {
      const result = await fetchUsers();
      setData(result.users || []);
      setTotalPages(result.totalPages || 1)
    }

    fetchData();
  }, [currentPage]);

  return (
    <div>
      <h2>List of Users</h2> <br />
      {/* <DataTable columns={columns} data={data} /> */}
      <UserTable data={data} onDelete={deleteItem} />
      <div className="mt-2 flex justify-center">
      <PaginationDemo
          currentPage={currentPage}
          setPageChange={setCurrentPage}
          totalPages={totalPages}
      />
      </div>
      {error && (
        <div className="text-red-500 mt-2">
          Error: {error.message}
        </div>
      )}
    </div>
  );
}
