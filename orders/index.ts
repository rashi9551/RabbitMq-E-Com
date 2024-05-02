import express from 'express'
import mongoose from 'mongoose'
import OrderRouter from './routes/routes'


const app=express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/orders',OrderRouter)


const mongoURI = 'mongodb://0.0.0.0:27017/orders';
mongoose.connect(mongoURI).then(()=>{
    console.log("connected");
  }).catch((error: Error) => {
    console.log(error);
  });

  app.listen(3003,()=>{
    console.log("http://localhost:3003 server is running mwoney");
})