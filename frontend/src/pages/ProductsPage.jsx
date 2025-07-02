import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Loader from "../componant/Layout/Loader";
import ProductCard from "../componant/Route/ProductCard/ProductCard";
import styles from "../styles/styles";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
const category = searchParams.get("category");
  const {products,isLoading} = useSelector((state) => state.product);
  const [data, setData] = useState([]);


  useEffect(() => {
    if (category === null) {
      const d = products;
      setData(d);
    } else {
      const d =
      // products && products.filter((i) => console.log(i.category.name));
      products && products.filter((i) => i.category.name === category);
      setData(d);
    }
    //    window.scrollTo(0,0);
  }, [products,category]);

  return (
  <>
  {
    isLoading ? (
      <Loader />
    ) : (
      <div>
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
        {data && data.length === 0 ? (
          <h1 className="text-center w-full pb-[100px] text-[20px]">
            No products Found!
          </h1>
        ) : null}
      </div>
    </div>
    )
  }
  </>
  );
};

export default ProductsPage;
