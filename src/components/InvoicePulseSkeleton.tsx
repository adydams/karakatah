export default function InvoicePulseSkeleton() {
  return (
    <div className="h-full w-[92%] animate-pulse items-center justify-between gap-5 md:flex md:w-4/5">
      {/* LEFT SIDE */}
      <div className="flex w-full flex-col gap-5 md:w-1/2">
        <div className="h-8 w-3/4 rounded bg-gray-300"></div>
        <div className="h-4 w-full rounded bg-gray-300"></div>
        <div className="h-4 w-5/6 rounded bg-gray-300"></div>

        <div className="mt-4 h-6 w-1/3 rounded bg-gray-300"></div>

        <div className="flex flex-col gap-2">
          <div className="h-3 w-1/2 rounded bg-gray-300"></div>
          <div className="h-3 w-2/3 rounded bg-gray-300"></div>
          <div className="h-3 w-1/3 rounded bg-gray-300"></div>
        </div>

        <div className="mt-4 h-10 w-40 rounded-full bg-gray-300"></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="mt-10 flex w-full flex-col gap-5 md:mt-0 md:w-1/2">
        <div className="h-6 w-1/2 rounded bg-gray-300"></div>

        <div className="grid grid-cols-3 gap-5">
          <div className="h-12 rounded bg-gray-300"></div>
          <div className="h-12 rounded bg-gray-300"></div>
          <div className="h-12 rounded bg-gray-300"></div>
        </div>

        {/* Products */}
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-20 w-20 rounded-xl bg-gray-300"></div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-4 w-3/4 rounded bg-gray-300"></div>
              <div className="h-3 w-1/2 rounded bg-gray-300"></div>
            </div>
            <div className="h-4 w-16 rounded bg-gray-300"></div>
          </div>
        ))}

        {/* Totals */}
        <div className="mt-3 flex flex-col gap-2">
          <div className="h-4 w-full rounded bg-gray-300"></div>
          <div className="h-4 w-full rounded bg-gray-300"></div>
          <div className="h-4 w-full rounded bg-gray-300"></div>
        </div>

        <div className="mt-3 h-6 w-1/2 rounded bg-gray-300"></div>
      </div>
    </div>
  );
}
