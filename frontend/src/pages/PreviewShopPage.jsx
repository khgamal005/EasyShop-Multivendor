import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Layout/Loader";
import { getAllProductsShop } from "../redux/slices/productslice";
import ProductCard from "../components/ProductCard/ProductCard";
import ShopInfoCard from "../components/Products/ShopInfoCard ";

const PreviewShopPage = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.product);



  useEffect(() => {
    if (id) {
      dispatch(getAllProductsShop(id));
    }
  }, [dispatch, id]);

  return (
    <div className="min-h-screen px-4 py-6">

      <h2 className="text-xl font-semibold mt-6 mb-4">Products</h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard data={product} key={index} />
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default PreviewShopPage;
