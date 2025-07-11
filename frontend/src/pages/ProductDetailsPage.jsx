import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";

const ProductDetailsPage = () => {
  const { products } = useSelector((state) => state.product);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

useEffect(() => {
  if (eventData !== null) {
    const data = events && events.find((i) => i._id === id);
    setData(data);
  } else {
    const data = products && products.find((i) => i._id === id);
    setData(data);
  }
}, [products, events, id, eventData]);



return (
  <div>
    {data ? (
      <>
        <ProductDetails data={data}  eventData={eventData}/>
        {!eventData && (
          <>
            <SuggestedProduct data={data} />
          </>
        )}
      </>
    ) : (
      <p>Loading product...</p>
    )}
  </div>
);
};

export default ProductDetailsPage;
