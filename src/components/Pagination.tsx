export default function Pagination() {
  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous button */}
      <button className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
        Prev
      </button>

      {/* Page numbers */}
      <button className="px-3 py-1 rounded-lg bg-orange-500 text-white font-medium">
        1
      </button>
      <button className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
        2
      </button>
      <button className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
        3
      </button>
      <span className="px-3 py-1">...</span>
      <button className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
        10
      </button>

      {/* Next button */}
      <button className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
        Next
      </button>
    </div>
  );
}
