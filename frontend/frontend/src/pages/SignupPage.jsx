import Singup from "../components/Signup/Signup"
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if(isAuthenticated === true){
      navigate("/");
    }
  }, [isAuthenticated, navigate])



  return (
    <div><Singup/></div>
  )
}

export default SignupPage