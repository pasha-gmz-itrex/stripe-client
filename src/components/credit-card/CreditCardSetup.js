import {Elements} from "@stripe/react-stripe-js";
import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {getToken} from "../../utils/TokenUtils";
import {VAULT_SERVER_URL} from "../../constants/AppConstants";
import CreditCardSetupForm from "./CreditCardSetupForm";

const CreditCardSetup = (props) => {
  const [setupIntentKey, setSetupIntentKey] = useState("");

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
              setSetupIntentKey(data.setupIntentKey)
            }
          });
      })

    return () => isSubscribed = false;
  }, []);

  const options = {
    clientSecret: setupIntentKey,
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
          setupIntentKey && (
            <Elements options={options} stripe={props.stripePromise}>
              <CreditCardSetupForm setupIntentKey={setupIntentKey} handleClose={props.handleClose}/>
            </Elements>
          )
        }
      </Modal.Body>
      {/*<Modal.Footer>*/}
      {/*</Modal.Footer>*/}
    </Modal>
  );
}

export default CreditCardSetup;
