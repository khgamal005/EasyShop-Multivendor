
import Hero from '../components/Hero/Hero';
import BestDeals from '../components/Route/BestDeals/BestDeals';
import Events from "../components/Events/Events";
import FeaturedProduct from '../components/FeaturedProduct/FeaturedProduct';
import Sponsored from '../components/Route/Sponsored';
import { getAllProducts, getProducts } from '../redux/slices/productslice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getCategories } from '../redux/slices/categorySlice';
import Categories from './Categories ';
import { loadUser } from '../redux/slices/userSlice';
import { loadSeller } from '../redux/slices/sellerslice';


const HomePage = () => {
    const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);




  useEffect(()=>{
   dispatch(getAllProducts());
   dispatch(getCategories());
       dispatch(getProducts());
       dispatch(loadUser());
       dispatch(loadSeller());

   



  
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
