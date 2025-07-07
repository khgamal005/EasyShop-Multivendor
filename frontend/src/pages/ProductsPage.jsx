import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Loader from "../componant/Layout/Loader";
import ProductCard from "../componant/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import { getProducts } from "../redux/slices/productslice";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, params] = useSearchParams();

  const { pro, isLoading = false } = useSelector((state) => state.product);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(""); // e.g. "-price", "name"

const keyword = searchParams.get("keyword")?.toLowerCase(); // correct
  const subcategory = searchParams.get("subcategory");
  const category = searchParams.get("category");

  // Build query string and fetch products
  useEffect(() => {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
  if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    if (sort) params.set("sort", sort);
    params.set("page", page);
    params.set("limit", 10);

    dispatch(getProducts(params.toString()));
  }, [keyword, category, subcategory, sort, page, dispatch]);

  // Update local state when product data changes
  useEffect(() => {
    if (pro?.data) {
      setData(pro.data);
    }
  }, [pro]);
useEffect(() => {
  console.log("Current search keyword:", keyword); // Verify keyword is received
}, [keyword]);

  const totalPages = pro?.paginationResult?.numberOfPages || 1;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full">
          {/* Sorting Controls */}
          <div className="flex justify-end px-4 mb-4">
            <select
              onChange={(e) => setSort(e.target.value)}
              className="border p-2 rounded"
              value={sort}
            >
              <option value="">Default</option>
              <option value="discountPrice">Price: Low to High</option>
              <option value="-discountPrice">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
              <option value="-name">Name: Z-A</option>
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12">
              {data.map((product, index) => (
                <ProductCard data={product} key={index} />
              ))}
            </div>

            {data.length === 0 && (
              <h1 className="text-center w-full pb-24 text-[20px]">
                No products found!
              </h1>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mb-10 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    page === i + 1 ? "bg-black text-white" : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductsPage;
