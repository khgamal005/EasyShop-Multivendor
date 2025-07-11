import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopCreate from '../../components/Shop/ShopCreate';


const ShopCreatePage = () => {
  const navigate = useNavigate();
  const { isSeller,seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if(isSeller){
      navigate(`/shop/${seller._id}`);
    }
  }, [isSeller, navigate])
  return (
    <div>
        <ShopCreate />
    </div>
  )
}

export default ShopCreatePage