import { FaFilter, FaSort, FaSearch, FaPlus } from "react-icons/fa";

interface DashboardHeaderProps {
  title: string;
  onNewClick: () => void;
  // Add props for handling filter/sort actions later
}

export default function DashboardHeader({
  title,
  onNewClick,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col border-b border-gray-300 pb-2 mb-4">
      {/* Title & Actions Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <FaSort
            className="cursor-pointer hover:text-gray-800 transition"
            title="Sort"
          />
          <FaFilter
            className="cursor-pointer hover:text-gray-800 transition"
            title="Filter"
          />
          <FaSearch
            className="cursor-pointer hover:text-gray-800 transition"
            title="Search"
          />
          <button
            onClick={onNewClick}
            className="flex items-center bg-blue-500 text-white px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-blue-600 transition ml-4"
          >
            <FaPlus className="mr-1 text-xs" />
            New
          </button>
        </div>
      </div>
    </div>
  );
}
