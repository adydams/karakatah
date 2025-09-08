import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../App.css";
import Slider from "react-slick";

const data = ["slide1.jpg", "bg.png", "snake.png"];

export default function SliderHero() {
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
      <Slider {...settings}>
        {data.map((pic, index) => (
          <div className="h-full w-full" key={index}>
            <img
              className="h-full w-full bg-cover bg-center"
              src={pic}
              alt=""
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
