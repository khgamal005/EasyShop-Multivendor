
import Hero from '../componant/Hero/Hero';
import Categories from '../componant/Categories/Categories';
import BestDeals from '../componant/Route/BestDeals/BestDeals';
import Events from "../componant/Events/Events";
import FeaturedProduct from '../componant/FeaturedProduct/FeaturedProduct';
import Sponsored from '../componant/Route/Sponsored';

const HomePage = () => {


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
