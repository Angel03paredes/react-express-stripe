import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import React, { useState } from "react";

import "bootswatch/dist/lux/bootstrap.min.css";

const stripePromise = loadStripe(
  "pk_test_51JAjM9APuejCd7PbDxsKEr60V3CbQbqlulXc7j8jETS4x775ZBo8eax9KExx8CzzbbROhtlXunivUloyb1Q9A6qO00TMhTxxN4"
);

const CheckOutForm = () => {
  const [ loading, setLoading ] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setLoading(true);
    if (!error) {
      const { id } = paymentMethod;
      try {
        const res = await axios.post(
          "http://localhost:3001/api/paymentmethod",
          {
            id,
            amount: 1000,
          }
        );
        elements.getElement(CardElement).clear();
        if(res.status === 200){
          console.log(res);
          alert(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    } else {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3">
      <img src="https://www.officedepot.com.mx/medias/100021757.jpg-1200ftw?context=bWFzdGVyfHJvb3R8ODQwNTl8aW1hZ2UvanBlZ3xoMWIvaDVmLzEwMDUxMjU5MjY5MTUwLmpwZ3xkZDRiMjUwZDcwNTkzYTIyZGY0MWI3MWE3MTU2NTE3OTZjN2FhNGI1Nzc5NmY0NGQwYTczZmIzZTZhMzU0ODE1"></img>
      <CardElement className="form-control" />
      <button className="btn btn-success" disabled={!stripe}>
        {loading ? (
          <div className="spinner-border text-light" role="status">
            
          </div>
        ) : (
          "BUY"
        )}
      </button>
    </form>
  );
};

function App() {
  return (
    <div className="form-group">
      <Elements stripe={stripePromise}>
        <div className="container p-4">
          <div className="row">
            <div className="col-md-4 offset-md-4">
              <CheckOutForm></CheckOutForm>
            </div>
          </div>
        </div>
      </Elements>
    </div>
  );
}

export default App;
