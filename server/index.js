const express = require('express');
const Stripe = require('stripe');
const cors = require("cors");

const stripe = new Stripe('sk_test_51JAjM9APuejCd7PbpFvM1HXd4knJ4EiSRdf86ibOig0AtORGDVrLWWNuKoXok61lPhnhXhAD6n8np5sfoIbnCpyW00Ge8SsL1R');
const app = express();
app.use(express.json());
app.use(cors());
app.set("port",process.env.PORT || 3001);


app.post('/api/paymentmethod',async (req,res)=>{
   try{
    const {id,amount} = req.body
    const payment = await stripe.paymentIntents.create({
        amount,
        currency:"USD",
        description: "Mouse Gaming",
        payment_method:id,
        confirm:true
    });
    res.status(200).json({message:"Successful payment",payment});
   }catch(error){
        res.status(500).json({message:error})
   }
});

app.listen(app.get('port'));