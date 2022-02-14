import React, {useEffect, useState} from "react";
import {Elements} from "@stripe/react-stripe-js";

import {loadStripe} from "@stripe/stripe-js/pure";
import {useParams} from "react-router-dom";
import PaymentRequestButtonCheckoutForm from "./PaymentRequestButtonCheckoutForm";
import {SALE_SERVER_URL} from "../../constants/AppConstants";
import {getToken} from "../../utils/TokenUtils";
const stripePromise = loadStripe("pk_test_51K6wNoJJ3Q3hxjxGxRzq3jon7Nm52pptZO3fNskGdpPuxa2dUxM8P5DsJLnrJTvcjcjecDi9ZEhxXf7dDcQzRXNz00UROIepRn");

const PaymentRequestButtonCheckout = (props) => {
  const { id } = useParams();

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {

    if (!id) {
      return;
    }

    let isSubscribed = true;

    getToken().then((res) => {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + res.access_token);

        fetch(SALE_SERVER_URL + "/sale/stripe/authorize", {
          method: "POST",
          headers: headers,
          // mode: 'no-cors',
          body: JSON.stringify({
            productId: id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {

            if (isSubscribed) {
              setClientSecret(data.client_secret);
            }
          })
          .catch((err) => {
              console.log("error");
              console.log(err);
            });
          });
    return () => isSubscribed = false;
  }, [id]);

  const guid = () => {
    function _p8(s) {
      var p = (Math.random().toString(16)+"000000000").substr(2,8);
      return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
  }


  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <PaymentRequestButtonCheckoutForm clientSecret={clientSecret}/>
        </Elements>
      )}
    </div>
  );
}

export default PaymentRequestButtonCheckout;
