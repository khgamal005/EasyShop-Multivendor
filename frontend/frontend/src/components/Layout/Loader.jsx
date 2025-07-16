
import Lottie from "lottie-react";
import animationData from "../../assets/animations/Animation - 1744674826020.json";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center fixed top-0 left-0 bg-white bg-opacity-70 z-50">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
};

export default Loader;
