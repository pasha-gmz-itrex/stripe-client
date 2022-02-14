import React from "react";
import {useParams} from "react-router-dom";

import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import GooglePay from "./GooglePay";
const stripePromise = loadStripe("pk_test_51K6wNoJJ3Q3hxjxGxRzq3jon7Nm52pptZO3fNskGdpPuxa2dUxM8P5DsJLnrJTvcjcjecDi9ZEhxXf7dDcQzRXNz00UROIepRn");


const GooglePayWrapper = (props) => {

  const { id } = useParams();

  return (
      <Elements stripe={stripePromise}>
        <GooglePay productId={id}/>
      </Elements>
  );
}

export default GooglePayWrapper;
