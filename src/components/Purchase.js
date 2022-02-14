import {Link} from "react-router-dom";
import {PRODUCT_SERVER_URL} from "../constants/AppConstants";
import React, {useEffect, useState} from "react";
import {getToken} from "../utils/TokenUtils";

const Purchase = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isSubscribed = true;

    getToken().then((res) => {
        const provider = "credit-card";
        fetch(PRODUCT_SERVER_URL + "/purchase/" + provider + "/catalog", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Bearer " + res.access_token,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            const items = data.items;
            if (isSubscribed) {
              setProducts(items)
            }
          });

        return () => isSubscribed = false;
      }
    )
  }, []);

  return (
    <div className="purchase">

      <div className="purchase-title">
        List of available products
      </div>

      <ul>
        {products.map((product, index) => (
          <li key={product.productId}>
            <Link
              to={{
                pathname: `/purchase/${product.productId}`
              }}
            > <span>{product.name}</span> </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Purchase;
