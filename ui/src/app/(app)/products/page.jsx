import SearchBar from "@/components/serchBar/Search";
import { useState } from "react";
function page() {
     const [searchQuery, setSearchQuery] = useState("");
     const filteredData =
     data?.filter(
       (product) =>
         (product.productName &&
           product.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
         (product.category &&
           product.category.toLowerCase().includes(searchQuery.toLowerCase()))
     ) || [];


    return (
        <div>
            <SearchBar onSearch={setSearchQuery}/>
            content products
        </div>
    );
}

export default page;