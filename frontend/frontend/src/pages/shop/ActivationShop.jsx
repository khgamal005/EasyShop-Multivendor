import axios from 'axios';
import { server } from "../../server";
  import { Link, useParams } from 'react-router-dom';
  import { useState, useEffect } from 'react';
  
  const ActivationShop = () => {
    const { token } = useParams();
    const [error, setError] = useState(false);
    const [errorData, setrrorData] = useState("");
    
  
    useEffect(() => {
      if (token) {
        const sendRequest = async () => {
          try {
            // Replace :token with the actual token value and use GET
            await axios.get(`${server}/shop/activation/${token}`, { withCredentials: true });
       
          } catch (err) {
            setrrorData(err.response.data.message)
 
            
          
            setError(true);
          }
        };
        sendRequest();
      }
    }, [token]);
  
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {error ? (
   
         <p style={{ color: "red", fontWeight: "bold" }}>{errorData}</p>
        ) : (
          <div>
            <p>Your account has been created successfully. Please login!</p>
           <button className='text-blue-600 pl-2'>  <Link to="/shop-login">Click here to login</Link></button>

          </div>

          
          
        )}
      </div>
    );
  };
  


export default ActivationShop