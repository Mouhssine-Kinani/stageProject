"use client";
import { useState, useRef } from "react";
import { useEffect } from "react";
// Custom Ellipsis Dropdown Component
const EllipsisDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle menu actions
  const handleAction = (action) => {
    console.log(`Action: ${action}`);
    setIsOpen(false);
    // Add your logic here for different actions
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Ellipsis trigger button */}
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        onClick={toggleDropdown}
      >
        <span className="font-bold">...</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            <button
              onClick={() => handleAction("delete")}
              className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>

            <button
              onClick={() => handleAction("update")}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function Table({ data, headers }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No data available</p>;
  }

  // Ensure headers are based on the data structure, i.e., keys from the first object
  const tableHeaders = headers || Object.keys(data[0]);

  return (
    <div className="fetchedData">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 border-b-2 border-gray-300">
                #
              </th>
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-400 border-b-2 border-gray-300"
                >
                  {header}
                </th>
              ))}
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 border-b-2 border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                {tableHeaders.map((header, i) => (
                  <td key={i} className="px-4 py-2">
                    {item[header] || "N/A"}
                  </td>
                ))}
                <td className="px-4 py-2">
                  <EllipsisDropdown />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}




export default Table;
