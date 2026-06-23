type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = [];

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg bg-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>

      {/* First page */}
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-lg bg-gray-200 px-4 py-2"
          >
            1
          </button>

          {start > 2 && <span>...</span>}
        </>
      )}

      {/* Visible Pages */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-lg px-4 py-2 text-sm transition-all
            ${
              currentPage === page
                ? "bg-orange text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span>...</span>}

          <button
            onClick={() => onPageChange(totalPages)}
            className="rounded-lg bg-gray-200 px-4 py-2"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg bg-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}