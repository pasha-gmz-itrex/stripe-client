import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";

const PurchaseProduct = (props) => {

  return (

    <div className="purchase-product">
      <div className="purchase-product-title">
        List of available payment flows
      </div>
      <ul>
        <li key='checkout'>
          <Link
            to={{
              pathname: `/purchase/${props.productId}/standard-checkout/`
            }}
          > <span>Standard checkout flow</span> </Link>
        </li>

        <li key='credit-card'>
          <Link
            to={{
              pathname: `/purchase/${props.productId}/credit-card`
            }}
          > <span>Credit card flow</span> </Link>
        </li>

        <li key='payment-element'>
          <Link
            to={{
              pathname: `/purchase/${props.productId}/payment-element`
            }}
          > <span>Payment element flow</span> </Link>
        </li>

        <li key='payment-request-button'>
          <Link
            to={{
              pathname: `/purchase/${props.productId}/google-pay`
            }}
          > <span>Google pay flow</span> </Link>
        </li>

      </ul>
    </div>
  );
}

export default PurchaseProduct;
