import { useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { DialogDemo } from "@/components/popup/dialogDemo";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center border-2 border-gray-500 rounded-md p-2 w-full justify-between">
      {/* Boutons (à gauche) */}
      <div className="flex items-center gap-2">
        <DialogDemo buttonTitle="+" />
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <Filter size={18} />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700">
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