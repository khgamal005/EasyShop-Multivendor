
import Hero from '../componant/Hero/Hero';
import Categories from '../componant/Categories/Categories';
import BestDeals from '../componant/Route/BestDeals/BestDeals';
import Events from "../componant/Events/Events";
import FeaturedProduct from '../componant/FeaturedProduct/FeaturedProduct';
import Sponsored from '../componant/Route/Sponsored';
import { getAllProducts } from '../redux/slices/productslice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getCategories } from '../redux/slices/categorySlice';
import { getSubCategories } from '../redux/slices/subcategorySlice';


const HomePage = () => {
    const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);





  useEffect(()=>{
   dispatch(getAllProducts());
   dispatch(getCategories());
   dispatch(getSubCategories());


  
  },[])

  return (
    <div>
     <Hero/>
     <Categories />
     <BestDeals products={products} />
     <Events />
     <FeaturedProduct products={products} />
     <Sponsored />

    </div>
  );
};

export default HomePage;
