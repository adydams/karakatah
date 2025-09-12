export default function ProductDetailsSkeleton() {
  return (
    <div className="mt-3 flex animate-pulse flex-col items-start justify-start lg:mt-0 lg:h-full lg:w-1/2 lg:p-3">
      {/* Title */}
      <div className="h-8 w-3/4 rounded-md bg-gray-300"></div>

      {/* Description */}
      <div className="mt-2 h-4 w-full rounded-md bg-gray-200"></div>
      <div className="mt-1 h-4 w-5/6 rounded-md bg-gray-200"></div>

      {/* Availability */}
      <div className="mt-3 h-4 w-1/3 rounded-md bg-gray-200"></div>

      {/* Color */}
      <div className="mt-3 h-4 w-1/4 rounded-md bg-gray-200"></div>

      {/* Size */}
      <div className="mt-3 h-4 w-1/4 rounded-md bg-gray-200"></div>

      {/* Price */}
      <div className="mt-10 h-10 w-32 rounded-md bg-gray-300"></div>

      {/* Quantity controls */}
      <div className="mt-5 flex w-full items-center justify-between gap-2">
        <div className="h-6 w-6 rounded-full bg-gray-300"></div>
        <div className="h-6 w-[50px] rounded-md bg-gray-200"></div>
        <div className="h-6 w-6 rounded-full bg-gray-300"></div>
      </div>

      {/* Button */}
      <div className="mt-3 h-10 w-32 rounded-md bg-gray-400"></div>
    </div>
  );
}