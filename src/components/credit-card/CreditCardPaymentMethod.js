import {CardElement, CardNumberElement, Elements, PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import PaymentElementCheckout from "../payment-elments/PaymentElementCheckout";
import {getToken} from "../../utils/TokenUtils";
import {VAULT_SERVER_URL} from "../../constants/AppConstants";

const CreditCardPaymentMethod = (props) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    let isSubscribed = true;

    getToken().then((res) => {
        const headers = new Headers();
        headers.append("Accept",  "application/json");
        headers.append("Content-Type",  "application/json");
        headers.append("Authorization",  "Bearer " + res.access_token);
        fetch(VAULT_SERVER_URL + "/vault/credit-cards?provider=stripe", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({}),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (isSubscribed) {
              setClientSecret(data.setupIntentKey)
            }
          });
      })

    return () => isSubscribed = false;
  }, []);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="mdl-create-payment-method-title"> Create a new card </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          clientSecret && (
            <Elements options={options} stripe={props.stripePromise}>
              <PaymentElementCheckout clientSecret={clientSecret} handleClose={props.handleClose}/>
            </Elements>
          )
        }
      </Modal.Body>
      {/*<Modal.Footer>*/}
      {/*</Modal.Footer>*/}
    </Modal>
  );
}

export default CreditCardPaymentMethod;
