import { NavLink } from "react-router";
import { IoLogoInstagram } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <>
      <div
        className="flex h-[240px] w-full items-center justify-center lg:h-[180px]"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgb(15, 23, 42, 0.2), rgb(15, 23, 42, 1) ), url(bg.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex h-full w-[92%] flex-col items-center justify-center space-y-4 font-medium text-white lg:w-4/5 lg:flex-row lg:justify-between">
          <h3 className="font-primary text-center text-xl leading-tight lg:max-w-[40%] lg:text-left lg:text-2xl">
            From casual fits to sharp essentials, we’ve got you covered.
          </h3>
          <button className="text-primary font-primary text-deep-blue rounded-full bg-white px-4 py-2 text-xs drop-shadow-md lg:text-sm">
            Get yours today
          </button>
        </div>
      </div>
      <footer className="bg-deep-blue flex h-auto w-full items-center justify-center py-20 text-white lg:h-[500px]">
        <div className="font-secondary flex h-full w-[92%] flex-col items-center justify-start lg:w-4/5">
          <div className="grid w-full grid-cols-2 space-y-5 lg:grid-cols-[2fr_1fr_1fr_2fr] lg:space-y-0">
            <h5 className="font-primary col-span-2 col-start-1 text-center text-2xl font-bold lg:col-auto lg:col-start-auto lg:text-left">
              Karakata
            </h5>
            <ul className="space-y-2 text-center text-xs lg:text-left">
              <li>
                <NavLink to="/product" className="text-sm font-medium">
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="hover:text-primary font-light text-gray-300 duration-300"
                >
                  Categories
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="hover:text-primary font-light text-gray-300 duration-300"
                >
                  New arrivals
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="hover:text-primary font-light text-gray-300 duration-300"
                >
                  Shop Now
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="hover:text-primary font-light text-gray-300 duration-300"
                >
                  Categories
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="hover:text-primary font-light text-gray-300 duration-300"
                >
                  Categories
                </NavLink>
              </li>
            </ul>
            <ul className="space-y-2 text-center text-xs lg:text-left">
              <li>
                <NavLink to="/product" className="text-sm font-medium">
                  Company
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="hover:text-primary font-light text-gray-300 duration-300"
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="hover:text-primary font-light text-gray-300 duration-300"
                >
                  Why choose us?
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="hover:text-primary font-light text-gray-300 duration-300"
                >
                  Testimonials
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="hover:text-primary font-light text-gray-300 duration-300"
                >
                  Categories
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="hover:text-primary font-light text-gray-300 duration-300"
                >
                  Categories
                </NavLink>
              </li>
            </ul>

            <div className="col-span-2 col-start-1 flex flex-col items-center justify-start space-y-5 lg:col-auto lg:col-start-auto lg:items-end">
              <h5 className="font-medium">Socials</h5>
              <div className="flex items-center justify-center gap-7 lg:justify-end">
                <a href="#">
                  <IoLogoInstagram className="hover:text-primary font-light text-gray-300 duration-300" />
                </a>
                <a href="#">
                  <FaFacebook className="hover:text-primary font-light text-gray-300 duration-300" />
                </a>
                <a href="#">
                  <FaXTwitter className="hover:text-primary font-light text-gray-300 duration-300" />
                </a>
              </div>
              <p className="text-center text-xs leading-tight font-light text-gray-300 lg:text-right">
                Block B, Crescent Estate <br />
                Victoria Island, Lagos Nigeria.
              </p>
              <p className="text-center text-xs leading-tight font-light text-gray-300 lg:text-right">
                0811 467 9390
              </p>
            </div>
          </div>
          <div className="font-secondary mt-20 flex w-[92%] flex-col items-center justify-center space-y-3 lg:mt-auto lg:w-4/5">
            <hr className="h-px w-4/5 border-0 bg-gray-300 opacity-70" />
            <p className="text-center text-xs leading-tight font-light text-gray-300">
              &copy; 2025 Karakata Inc. All Rights Reserved{" "}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
