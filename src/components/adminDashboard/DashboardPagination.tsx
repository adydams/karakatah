type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

export default function DashboardPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  const pages = [];

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-200 transition-colors"
      >
        Prev
      </button>

      {/* First page */}
      {start > 1 && (
        <>
          <button
            onClick={() => setCurrentPage(1)}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            1
          </button>
          {start > 2 && <span className="text-gray-400 text-xs">...</span>}
        </>
      )}

      {/* Visible Pages */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            currentPage === page
              ? "bg-[#f57c00] text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-400 text-xs">...</span>}
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-200 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
