import  { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from '../redux/slices/userSlice';
import Hero from '../componant/Hero/Hero';
import Categories from '../componant/Categories/Categories';
import BestDeals from '../componant/Route/BestDeals/BestDeals';
import Events from "../componant/Events/Events";
import FeaturedProduct from '../componant/FeaturedProduct/FeaturedProduct';
import Sponsored from '../componant/Route/Sponsored';

const HomePage = () => {
  const dispatch = useDispatch();



  useEffect(() => {
    dispatch(loadUser()); 
  }, [dispatch]);


  return (
    <div>
     <Hero/>
     <Categories />
     <BestDeals />
     <Events />
     <FeaturedProduct />
     <Sponsored />

    </div>
  );
};

export default HomePage;
