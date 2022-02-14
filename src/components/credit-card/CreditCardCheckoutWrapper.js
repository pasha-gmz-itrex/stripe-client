import React from "react";
import ProductPayment from "./CreditCardCheckout";
import {useParams} from "react-router-dom";

import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import CreditCardCheckout from "./CreditCardCheckout";
import {STRIPE_PK} from "../../constants/AppConstants";
const stripePromise = loadStripe(STRIPE_PK);

const CreditCardCheckoutWrapper = (props) => {

  const { id } = useParams();

  return (
      <Elements stripe={stripePromise}>
        <CreditCardCheckout productId={id}/>
      </Elements>
  );
}

export default CreditCardCheckoutWrapper;
