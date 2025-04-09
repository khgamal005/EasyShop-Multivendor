import { useNavigate } from "react-router-dom";
import Login from "../componant/Login/Login"
import { useSelector } from "react-redux";
import { useEffect } from "react";


function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if(isAuthenticated === true){
      navigate("/");
    }
  }, [isAuthenticated, navigate])
  return (
    <>
    <Login/>
    </>
  )
}

export default LoginPage