import { useNavigate } from "react-router-dom";
import Login from "../../componant/Login/Login"
import { useSelector } from "react-redux";
import { useEffect } from "react";


function LoginSellerPage() {
  const navigate = useNavigate();
  const { isSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    if(isSeller === true){
      navigate(`/dashboard`);
    }
  }, [isSeller, navigate])
  return (
    <>
    <Login/>
    </>
  )
}

export default LoginSellerPage