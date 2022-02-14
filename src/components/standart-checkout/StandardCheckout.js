import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {JAVA_SERVER_URL} from "../../constants/AppConstants";

const StandardCheckout = (props) => {

  const { id } = useParams();

  return (
    <div>
      {
        id &&
        <form action={JAVA_SERVER_URL + "/checkout/create-session/"} method="POST">
          <label id = "productTitle"
            placeholder="Product Title"
          >
            Product ID: {id}
          </label>

          <input
            name = "productID"
            id = "productID"
            type="text"
            value={id}
            placeholder="Product ID"
            readOnly={true}
            hidden={true}
            // onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">
            Pay
          </button>
        </form>
      }

    </div>

  );
}

export default StandardCheckout;
