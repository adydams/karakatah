import { useEffect, useState } from "react";
import type { ProductImage } from "../services/serviceTypes";

type ImageSliderProps = {
  images?: ProductImage[]; // allow undefined too
};

export default function ImageSlider({ images }: ImageSliderProps) {
  const [imageBg, setImageBg] = useState<string>(images?.[0]?.url ?? "");

  useEffect(() => {
    if (images) {
      setImageBg(images?.[0].url);
    }
  }, [setImageBg, images]);

  return (
    <div className="mb-3 flex h-[350px] w-full flex-col items-start justify-start gap-3 lg:h-[400px] lg:w-1/2">
      <div className="h-[80%] w-full overflow-hidden rounded-lg">
        <img
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={imageBg}
          alt=""
        />
      </div>
      <div className="flex h-[20%] w-full items-center justify-center gap-2 overflow-hidden rounded-md">
        {images?.map((image, index) => (
          <div
            key={index}
            onClick={() => setImageBg(image.url)}
            className="h-full w-full cursor-pointer rounded-md"
          >
            <img
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              src={image.url}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}
