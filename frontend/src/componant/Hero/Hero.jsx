import { Link } from "react-router-dom";
import heroBg from "../../assets/pexels-anna-nekrashevich-7552326.jpg"; 

const Hero = () => {
  return (
    <div
      className="relative min-h-[70vh] 800px:min-h-[80vh] w-full flex items-center bg-cover bg-center bg-no-repeat"
      style={{
   backgroundImage: `url(${heroBg})`,
      }}
    >
      <div className="ml-8 800px:ml-20 bg-white/80 p-6 rounded-lg max-w-[600px]">
        <h1 className="text-[32px] 800px:text-[56px] font-bold text-gray-800 leading-tight capitalize">
          Elevate Your Everyday <br /> with EasyShop
        </h1>
        <p className="pt-4 text-[16px] text-gray-700">
          Discover stylish essentials, smart solutions, and home comforts — all in one place.
        </p>
        <Link to="/products" className="inline-block">
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
