import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Header from "../componant/Layout/Header";
import Loader from "../componant/Layout/Loader";
import ProductCard from "../componant/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import Footer from "../componant/Layout/Footer";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const [allProducts, isLoading] = useState([]);
  // const {allProducts,isLoading} = useSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a,b) => b.sold_out - a.sold_out); 
    setData(sortedData);
  }, [allProducts]);

  return (
   <>
   {
    isLoading ? (
      <Loader />
    ) : (
      <div>
      <Header activeHeading={2} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
      </div>
      <Footer />
    </div>
    )
   }
   </>
  );
};

export default BestSellingPage;
