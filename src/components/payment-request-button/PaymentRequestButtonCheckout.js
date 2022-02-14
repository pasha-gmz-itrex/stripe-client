import React, {useEffect, useState} from "react";
import {Elements} from "@stripe/react-stripe-js";

import {loadStripe} from "@stripe/stripe-js/pure";
import {useParams} from "react-router-dom";
import PaymentRequestButtonCheckoutForm from "./PaymentRequestButtonCheckoutForm";
const stripePromise = loadStripe("pk_test_51K6wNoJJ3Q3hxjxGxRzq3jon7Nm52pptZO3fNskGdpPuxa2dUxM8P5DsJLnrJTvcjcjecDi9ZEhxXf7dDcQzRXNz00UROIepRn");

const PaymentRequestButtonCheckout = (props) => {
  const { id } = useParams();

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {

    if (!id) {
      return;
    }

    let isSubscribed = true;

    var myHeaders = new Headers();
    myHeaders.append("X-Device", "web/12.0");
    myHeaders.append("Authorization", "Basic bWVldG1lOnNlY3JldA==");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Cookie", "COOK_INDICATOR=1; COOK_USERID=CzVSNAdlXWADMlc2BDUDOQ%3D%3D; PHPSESSID=8231f45cc3e6244decf454145fe1cc4f");

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "urn:ietf:params:oauth:grant-type:token-exchange");
    urlencoded.append("subject_token", "8231f45cc3e6244decf454145fe1cc4f");
    urlencoded.append("subject_token_type", "urn:ietf:params:oauth:token-type:session");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    const newOrderId = guid();

    fetch("http://auth.gateway.pgomza.dev.use1.amz.mtmetest.com/oauth/token", requestOptions)
      .then(response => response.json())
      .then((res) => {

        var headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + res.access_token);
        // headers.append("Access-Control-Allow-Origin", "*");

        // fetch("http://localhost:8081/sale/stripe/orders/" + newOrderId, {
        //   method: "PUT",

        fetch("http://localhost:8081/sale/stripe/authorize", {
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
