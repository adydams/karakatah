type DashboardPaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function DashboardPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: DashboardPaginationProps) {
  const pages = [];

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-5 flex items-center justify-center gap-2 self-end text-xs font-semibold">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        className="border-dark-gray/20 hover:bg-light-gray rounded-full border px-4 py-2 disabled:opacity-40"
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`rounded-full px-4 py-2 transition
            ${
              currentPage === page
                ? "bg-orange text-white"
                : "border-dark-gray/20 hover:bg-light-gray border"
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="border-dark-gray/20 hover:bg-light-gray rounded-full border px-4 py-2 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}