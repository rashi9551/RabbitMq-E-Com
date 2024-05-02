import express from 'express'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser'
import productRouter from './routes/routes'

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cookieSession({
    name:'session',
    signed:false,
    secure:false
}))

app.use('/products',productRouter)

const mongoURI = 'mongodb://0.0.0.0:27017/products';
mongoose.connect(mongoURI).then(()=>{
    console.log("connected");
  }).catch((error: Error) => {
    console.log(error);
  });

  app.listen(3002,()=>{
    console.log("http://localhost:3002 server is running mwoney");
})
