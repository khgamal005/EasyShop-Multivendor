// StripeWrapper.jsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useState, useEffect } from "react";
import { server } from "../server";

const StripeWrapper = ({ children }) => {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    axios.get(`${server}/payment/stripeapikey`).then(({ data }) => {
      console.log(data)
      setStripePromise(loadStripe(data.stripeApikey));
    });
  }, []);

  if (!stripePromise) return <div>Loading payment...</div>;

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeWrapper;
