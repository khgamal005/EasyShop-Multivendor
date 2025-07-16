import axios from 'axios';
import { server } from "../server";
  import { Link, useParams } from 'react-router-dom';
  import { useState, useEffect } from 'react';
  
  const ActivationPage = () => {
    const { token } = useParams();
    const [error, setError] = useState(false);
  
    useEffect(() => {
      if (token) {
        const sendRequest = async () => {
          try {
            // Replace :token with the actual token value and use GET
             await axios.get(`${server}/user/activation/${token}`, { withCredentials: true });
       
          } catch (err) {
            console.log(err);
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
          <p>Your token is expired or invalid!</p>
        ) : (
          <div>
            <p>Your account has been created successfully. Please login!</p>
           <button className='text-blue-600 pl-2'>  <Link to="/login">Click here to login</Link></button>

          </div>

          
          
        )}
      </div>
    );
  };
  


export default ActivationPage