export default function ProductImagePulse() {
  return (
    <div className="mb-3 flex h-[350px] w-full flex-col items-start justify-start gap-3 lg:h-[400px] lg:w-1/2 animate-pulse">
      {/* Big image placeholder */}
      <div className="h-[80%] w-full overflow-hidden rounded-lg bg-gray-200" />

      {/* Thumbnail placeholders */}
      <div className="flex h-[20%] w-full items-center justify-center gap-2 overflow-hidden rounded-md">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-full w-full rounded-md bg-gray-200"
          />
        ))}
      </div>
    </div>
  );
}
