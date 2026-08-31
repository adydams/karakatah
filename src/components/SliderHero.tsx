import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../App.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { getFeaturedDiscounts } from "../services/apiProducts";
import { optimizeImage } from "../utils/imageUtils";

const staticBanners = [
  "/images/landing-carousel-1.png",
  "/images/landing-carousel-2.png",
  "/images/landing-carousel-3.png",
];

type FeaturedProduct = {
  id: string;
  name: string;
  images: { url: string }[];
  currentPrice: number;
  originalPrice: number;
  discountPercent: number;
};

export default function SliderHero() {
  const [slides, setSlides] = useState<{ type: 'banner' | 'product', content: any }[]>(
    staticBanners.map(img => ({ type: 'banner', content: img }))
  );

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await getFeaturedDiscounts();
        if (res && res.success && res.data) {
          const productSlides = res.data.map((p: FeaturedProduct) => ({
            type: 'product',
            content: p,
          }));
          setSlides([...staticBanners.map(img => ({ type: 'banner', content: img })), ...productSlides]);
        }
      } catch (err) {
        console.error("Failed to load featured discounts:", err);
      }
    }
    loadFeatured();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    lazyload: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="flex h-[250px] w-full items-center justify-center overflow-hidden lg:h-full lg:w-[68%]">
      <Slider {...settings} key={slides.length}>
        {slides.map((slide, index) => (
          <div className="relative h-full w-full" key={index}>
            {slide.type === 'banner' ? (
              <img
                className="h-full w-full object-cover"
                src={optimizeImage(slide.content)}
                alt="Promotional Banner"
              />
            ) : (
              <div className="relative h-full w-full">
                <img
                  className="h-full w-full object-cover"
                  src={optimizeImage(slide.content.images?.[0]?.url)}
                  alt={slide.content.name}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-2xl font-bold">{slide.content.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-lg line-through opacity-70">₦{slide.content.originalPrice}</span>
                    <span className="text-2xl font-bold text-orange-400">₦{slide.content.currentPrice}</span>
                  </div>
                  {/* Flashing Discount Badge */}
                  <div className="mt-2 inline-block animate-pulse rounded-full bg-orange-600 px-3 py-1 text-xs font-bold text-white">
                    -{slide.content.discountPercent}% OFF
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}
