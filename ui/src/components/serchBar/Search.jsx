import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";

const SearchBar = ({
  onSearch,
  onSort,
  Children: Children = null,
  ChildrenProps = {},
}) => {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // État du tri
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc"; // Alterner entre asc et desc
    setSortOrder(newOrder);
    onSort(newOrder); // Appeler la fonction de tri
  };

  return (
    <div
      className={`border-2 border-gray-500 rounded-md p-2 w-full ${
        isMobile ? "flex flex-col gap-3" : "flex items-center justify-between"
      }`}
    >
      {/* Boutons de gauche */}
      <div className="flex items-center gap-2 justify-between">
        {/* Actions et filtres */}
        <div className="flex items-center gap-2">
          {Children && <Children {...ChildrenProps} />}
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Filter size={18} />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={handleSort}
          >
            <ArrowUpDown size={18} />
          </button>
        </div>

        {/* Si mobile, montrer la barre de recherche sur toute la largeur mais dans le deuxième div */}
        {!isMobile && (
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
        )}
      </div>

      {/* Si mobile, montrer la barre de recherche sur une deuxième ligne */}
      {isMobile && (
        <div className="flex items-center border border-gray-400 rounded-md px-2 w-full">
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
      )}
    </div>
  );
};

export default SearchBar;
