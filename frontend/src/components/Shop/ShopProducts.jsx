import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllProductsShop, deleteProduct, getProduct } from "../../redux/slices/productslice";
import { getProductImageUrl } from "../../utils/imageHelpers"; // Update the path based on where it's defined
import EditProduct from "./EditProduct";
import {  useNavigate } from "react-router-dom";

const ShopProducts = () => {
  const { products, isLoading } = useSelector((state) => state.product);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleDelete = async (id) => {
    const action = await dispatch(deleteProduct(id));
    if (deleteProduct.fulfilled.match(action)) {
      toast.success("Product deleted successfully");
      dispatch(getAllProductsShop(seller._id));
    } else {
      toast.error(action.payload || "Failed to delete product");
    }
  };

  const getSpecificProduct = async (id) => {
        navigate(`/product/${id}`)
    setEdit(true); // Or open a modal here to edit
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        products?.map((product) => (
          <div key={product._id} className="bg-white rounded shadow p-4 relative">
            {/* Product Image */}
            {product.images?.length > 0 && (
              <img
                src={getProductImageUrl(product.images[0])}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-lg">{product.name}</h3>

            {/* Actions */}
            <div className="flex justify-between mt-3">
              <button
                onClick={() => getSpecificProduct(product._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              >
                Preview
              </button>
    
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
           
    </div>
  );
};

export default ShopProducts;
