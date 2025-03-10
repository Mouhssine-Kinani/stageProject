"use client";
import { useClients } from "@/components/getStatiques/getAllClients";
import SearchBar from "@/components/serchBar/Search";
import { useState } from "react";
function page() {
    const [searchQuery, setSearchQuery] = useState("");
    // const filteredData =
    // data?.filter(
    //   (client) =>
    //     (client.name &&
    //       client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //     (client.email &&
    //       client.email.toLowerCase().includes(searchQuery.toLowerCase()))
    // ) || [];
    return (
        <div>
            <div className="w-full searchbar">
            <SearchBar onSearch={setSearchQuery}/>
            </div>
            content client
        </div>
    );
}

export default page;