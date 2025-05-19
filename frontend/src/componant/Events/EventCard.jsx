import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartslice";
import { toast } from "react-toastify";
import { getEventImageUrl } from "../../utils/imageHelpers";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExists = cart?.some((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else if (data.stock < 1) {
      toast.error("Product stock limited!");
    } else {
      dispatch(addToCart({ ...data, qty: 1 }));
      toast.success("Item added to cart successfully!");
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg ${
        active ? "mb-0" : "mb-12"
      } lg:flex p-4 lg:p-6`}
    >
      {/* Image section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <img
          src={getEventImageUrl(data.images?.[0])}
          alt={data.name}
          className="max-h-64 object-contain rounded-md"
        />
      </div>

      {/* Content section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between mt-4 lg:mt-0 lg:pl-8">
        <div>
          <h2 className={`${styles.productTitle} text-2xl font-semibold mb-2`}>
            {data.name}
          </h2>
          <p className="text-gray-600 mb-4">{data.description}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-3">
              <span className="text-lg font-semibold text-red-600 line-through">
                {data.originalPrice}$
              </span>
              <span className="text-xl font-bold text-gray-900">
                {data.discountPrice}$
              </span>
            </div>
            <span className="text-green-600 font-medium text-lg">
              {data.sold_out} sold
            </span>
          </div>

          <CountDown data={data} />
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <button className={`${styles.button} bg-blue-600 hover:bg-blue-700`}>
              See Details
            </button>
          </Link>

          <button
            className={`${styles.button} bg-green-600 hover:bg-green-700`}
            onClick={() => addToCartHandler(data)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
