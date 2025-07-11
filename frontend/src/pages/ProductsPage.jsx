import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import { getProducts } from "../redux/slices/productslice";
import ProductSidebar from "../components/Products/ProductSidebar";

const ProductsPage = () => {
  const dispatch = useDispatch();
const [searchParams, setSearchParams] = useSearchParams();

  const { pro, isLoading = false } = useSelector((state) => state.product);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(""); 

  const keyword = searchParams.get("keyword")
  const subcategory = searchParams.get("subcategory");
  const category = searchParams.get("category");

    const handleFilterChange = (query) => {
    const params = new URLSearchParams();

    for (const key in query) {
      const value = query[key];
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }

    setSearchParams(params);
        dispatch(getProducts(params.toString()));
 // this updates the URL
  };

  // Build query string and fetch products
  useEffect(() => {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    if (sort) params.set("sort", sort);
    params.set("page", page);
    params.set("limit", 3);
        setSearchParams(params);


    dispatch(getProducts(params.toString()));
  }, [keyword, category, subcategory, sort, page, dispatch]);

  // Update local state when product data changes
  useEffect(() => {
    if (pro?.data) {
      setData(pro.data);
    }
  }, [pro]);


  const totalPages = pro?.paginationResult?.numberOfPages || 1;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
<div className="flex flex-col lg:flex-row gap-6 px-4">
  {/* Sidebar */}
  <ProductSidebar onFilterChange={handleFilterChange} />

  {/* Main Product Area */}
  <div className="flex-1">
    {/* Sorting */}
    <div className="flex justify-end mb-4">
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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
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
</div>

      )}
    </>
  );
};

export default ProductsPage;
