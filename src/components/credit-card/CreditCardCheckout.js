import CreditCardPaymentMethod from "./CreditCardPaymentMethod";

import React, {useEffect, useState} from "react";
import {Form, Modal} from "react-bootstrap";
import {Button} from "react-bootstrap"

import "bootstrap/dist/css/bootstrap.min.css";

import {loadStripe} from "@stripe/stripe-js";
import {useElements, useStripe} from "@stripe/react-stripe-js";
import {STRIPE_PK, VAULT_SERVER_URL} from "../../constants/AppConstants";
import {getToken} from "../../utils/TokenUtils";

const stripePromise = loadStripe(STRIPE_PK);

const CreditCardCheckout = (props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [ productId, setProductId ] = useState(null);

  const [currentCard, setCurrentCard] = useState("");
  const [cards, setCards ] = useState([]);
  const [initializedPaymentMethods, setInitializedPaymentMethods] = useState(false);

  const [resultMessage, setResultMessage] = useState(null);

  const [show, setShow] = useState(false);
  const [inPaymentProcess, setPaymentProcess] = useState(false);

  const handleAddCard = () => setShow(true);

  const handleClose = () => {
    // var myHeaders = new Headers();
    // myHeaders.append("X-Device", "web/12.0");
    // myHeaders.append("Authorization", "Basic bWVldG1lOnNlY3JldA==");
    // myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    // myHeaders.append("Cookie", "COOK_INDICATOR=1; COOK_USERID=CzVSNAdlXWADMlc2BDUDOQ%3D%3D; PHPSESSID=25d08001f88161eb2b58e1d5e947ff35");
    //
    // var urlencoded = new URLSearchParams();
    // urlencoded.append("grant_type", "urn:ietf:params:oauth:grant-type:token-exchange");
    // urlencoded.append("subject_token", "25d08001f88161eb2b58e1d5e947ff35");
    // urlencoded.append("subject_token_type", "urn:ietf:params:oauth:token-type:session");
    // var requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: urlencoded,
    //   redirect: 'follow'
    // };
    //
    // fetch("http://auth.gateway.pgomza.dev2.use1.amz.mtmetest.com/oauth/token", requestOptions)
    //   .then(response => response.json())
    //   .then((res) =>
    //     fetch("http://localhost:8081/vault/credit-cards?provider=stripe", {
    //       method: "GET",
    //       headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json",
    //         "Access-Control-Allow-Origin": "*",
    //         "Authorization": "Bearer " + res.access_token,
    //       },
    //     })
    //       .then((res) => res.json())
    //       .then((res) => {
    //         // setPaymentMethods(data);
    //         // var cards = res.cards;
    //         const methods = res.map(it => { return {"key": it.id, "value": it.name } } );
    //         setPaymentMethods(Array.from(new Set(methods)));
    //       })
    //   )
    //
    // setShow(false);
  }

  const handlePay = () => {
    setPaymentProcess(true);

    getToken().then((res) => {

        var headers = new Headers();
        headers.append("Accept",  "application/json");
        headers.append("Content-Type",  "application/json");
        headers.append("Authorization",  "Bearer " + res.access_token);
        fetch("http://localhost:8081/sale/stripe/authorize", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            productId: productId,
            cardId: currentCard
          }),
        })
          .then((res) => res.json())
          .then((data) => handlePaymentIntentResponse(data))
          .catch((err) => {
            console.log(err);
          });
      })
  }

  const handlePaymentSuccess = () => {
    setPaymentProcess(false);
    setResultMessage("Payment successfully created!");
  }

  const handlePaymentFailed = (details) => {
    setPaymentProcess(false);
    setResultMessage("Payment failed! " + details);
  }

  const handlePaymentIntentResponse = (data) => {
    console.log("handle payment intent response");
    console.log(data);

    if (data.confirmation_method === 'automatic') {
      stripe.confirmCardPayment(data.client_secret)
        .then((res) => res.paymentIntent)
        .then((paymentIntent) => {
          if (paymentIntent.status === 'succeeded') {
            handlePaymentSuccess();
          } else {
            handlePaymentFailed();
          }
        });
    } else {
      if (data.status === "requires_action") {
        // Use Stripe.js to handle required card action
        stripe.confirmCardPayment(data.client_secret)
          .then((response) => response.paymentIntent)
          .then(handlePaymentIntentResponse);
      } else if (data.status === "requires_confirmation") {
        handleReauthorize(data.id)
          .then((res) => res.json())
          .then(handlePaymentIntentResponse);
      } else if (data.status === "requires_capture") {
        handlePaymentSuccess();
      } else {
        handlePaymentFailed(data.status)
      }
    }
  }

  const handleReauthorize = (paymentIntentId) => {

    getToken().then((res) => {
        const headers = new Headers();
        headers.append("Accept",  "application/json");
        headers.append("Content-Type",  "application/json");
        headers.append("Authorization",  "Bearer " + res.access_token);
        return fetch("http://localhost:8081/sale/stripe/authorize/" + paymentIntentId, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify({
          }),
        })
      })
  }

  useEffect(() => {
    if (!props.productId) {
      return;
    }

    let isSubscribed = true;

    if (isSubscribed) {
      setProductId(props.productId);
    }

    return () => isSubscribed = false;
  }, [props.productId])

  useEffect(() => {
    let isSubscribed = true

    getToken().then((res) =>
        fetch(VAULT_SERVER_URL + "/vault/credit-cards?provider=stripe", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Bearer " + res.access_token,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            const cards = res.map(it => {
              return {"key": it.cardId, "value": it.name}
            });

            if (isSubscribed) {
              setCards(Array.from(new Set(cards)));
              setInitializedPaymentMethods(true);

              if (cards.length) {
                setCurrentCard(cards[0].key)
              }
            }
          })
      )

    return () => isSubscribed = false;
  }, []);

  return (
    <div>

      <div className="product-description">
        <span>
          {!productId ? <div className="spinner" id="spinner"/> : <div><b> Product ID: { productId } </b></div> }
        </span>
      </div>

      {!initializedPaymentMethods
        ? <div className="spinner" id="spinner" />
        :
        <Form.Group className="payment-methods-group">
          <Form.Label className="payment-methods-title">Please select payment card</Form.Label>
          <Form.Control className="payment-methods-control"
                        as="select"
                        value={currentCard.value}
                        onChange={e => setCurrentCard(e.target.value)}
          >
            {cards.map((card) => (
              <option id="payment-methods-form-element" key={card.key} value={card.key}> { card.value }</option>
            ))}
          </Form.Control>
        </Form.Group>
      }

      {
        inPaymentProcess
        ? <div className="spinner" id="spinner"/>
        :
          <div>
            <div className="btn-new-payment-method">
              <Button  variant="secondary" onClick={handleAddCard}> Add a new payment card </Button>
              <Button variant="primary" onClick={handlePay}> Pay now </Button>
            </div>

            <div className="result-message">{resultMessage}</div>
          </div>
      }

      <CreditCardPaymentMethod
        show={show}
        handleClose={handleClose}
        stripePromise={stripePromise}
      />
    </div>
  )
}

export default CreditCardCheckout;
