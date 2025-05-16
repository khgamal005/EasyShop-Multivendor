import { CgClose } from "react-icons/cg";

const DisplayImage = ({ imgUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="relative bg-white shadow-lg rounded-md max-w-5xl w-full max-h-[90vh] p-4 overflow-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-red-600"
        >
          <CgClose />
        </button>

        {/* Image Preview */}
        <div className="flex justify-center items-center max-h-[80vh]">
          <img
            src={imgUrl}
            alt=""
            className="max-h-[80vh] max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};


export default DisplayImage