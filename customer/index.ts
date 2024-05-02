const express=require('express')

const app=express()
const mongoose=require('mongoose')
const CustomerRouter=require('./routes/routes')
const cookieSession=require('cookie-session')


app.set('trust proxy',true)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieSession({
    name:'session',
    signed:false,
    secure:false,
}))

app.use('/customer',CustomerRouter)

const mongoURI = 'mongodb://0.0.0.0:27017/customer';
mongoose.connect(mongoURI).then(()=>{
    console.log("connected");
  }).catch((error: Error) => {
    console.log(error);
  });

  app.listen(3001,()=>{
    console.log("http://localhost:3001 server is running mwoney");
})