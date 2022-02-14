import React from "react";
import {useParams} from "react-router-dom";
import PurchaseProduct from "./PurchaseProduct";

const PurchaseProductWrapper = (props) => {

  const { id } = useParams();

  return (
    <div>
      {id && <PurchaseProduct productId={id}/>}
    </div>
  );
}

export default PurchaseProductWrapper;
