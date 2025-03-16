import { useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import AddUserDialog  from "@/app/(app)/usersf2/components/add-user-dialog";

const SearchBar = ({ onSearch, open, setOpen, handleUserAdded, children }) => {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // État du tri

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc"; // Alterner entre asc et desc
    setSortOrder(newOrder);
    // Only call onSort if it exists
    if (typeof onSort === 'function') {
      onSort(newOrder);
    }
  };

  return (
    <div className="flex items-center border-2 border-gray-500 rounded-md p-2 w-full justify-between">
      {/* Boutons (à gauche) */}
      <div className="flex items-center gap-2">
        {/* Render children if provided, otherwise use AddUserDialog */}
        {children }
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <Filter size={18} />
        </button>
        <button
          className="p-2 text-gray-500 hover:text-gray-700"
          // onClick={handleSort}
        >
          <ArrowUpDown size={18} />
        </button>
      </div>

      {/* Champ de recherche (à droite) */}
      <div className="flex items-center border border-gray-400 rounded-md px-2 w-full max-w-[37%]">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border-none focus:outline-none w-full"
          value={query}
          onChange={handleChange}
        />
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <Search size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;