import React, { useState} from "react";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";

import "./App.css";
import Products from "./components/Purchase";
import CheckoutSuccess from "./components/CheckoutSuccess";
import CheckoutFailed from "./components/CheckoutFailed";
import CreditCardCheckoutWrapper from "./components/credit-card/CreditCardCheckoutWrapper";
import PaymentElementCheckout from "./components/payment-elments/PaymentElementCheckout";
import StandardCheckout from "./components/standart-checkout/StandardCheckout";
import PaymentRequestButtonCheckout from "./components/payment-request-button/PaymentRequestButtonCheckout";
import GooglePayWrapper from "./components/payment-request-button/GooglePayWrapper";
import ProductPaymentWrapper from "./components/PurchaseProductWrapper";
import Purchase from "./components/Purchase";

export default function App() {

  const PurchaseLayout = () => (
    <div>
      <Outlet />
    </div>
  )

  return (

    <BrowserRouter>
      <Routes>
        <Route path="" element={<PurchaseLayout/>}>

          <Route path="/" element={<Purchase />} />
          <Route path="/purchase/" element={<Purchase />} />
          <Route path="/purchase/:id" element={<ProductPaymentWrapper />} />

          <Route path="/purchase/:id/standard-checkout" element={<StandardCheckout />} />
          <Route path="/purchase/:id/credit-card" element={<CreditCardCheckoutWrapper/>} />
          <Route path="/purchase/:id/payment-element" element={<PaymentElementCheckout/>} />
          <Route path="/purchase/:id/payment-request-button" element={<PaymentRequestButtonCheckout/>} />

          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/checkout-failed" element={<CheckoutFailed />} />

          <Route path="/purchase/:id/google-pay" element={<GooglePayWrapper />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
