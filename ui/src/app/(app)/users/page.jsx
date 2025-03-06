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
      <DataTable columns={columns} data={data} />
      <div className="mt-2">
        <PaginationDemo />
      </div>
    </div>
  );
}
