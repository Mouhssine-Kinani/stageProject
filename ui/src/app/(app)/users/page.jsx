"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/app/(app)/users/columns";
import {PaginationDemo} from "@/components/pagination/pagination";

async function fetchUsers() {
  try {
    const resp = await axios.get(`${process.env.NEXT_PUBLIC_URLAPI}/users/`);
    return resp.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export default function Page() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginateData = data.slice(startIndex, endIndex)

  useEffect(() => {
    async function fetchData() {
      const result = await fetchUsers();
      setData(result || []); 
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2>List of Users</h2> <br />
      <DataTable columns={columns} data={paginateData} />
      <div className="mt-2 flex justify-center">
      <PaginationDemo
          currentPage={currentPage}
          setPageChange={setCurrentPage}
          totalPages={Math.ceil(data.length / itemsPerPage)}
      />
      </div>
    </div>
  );
}
