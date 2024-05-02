const Router =require('express').Router
import { Application, NextFunction, Request, Response } from 'express'
const router=new Router()
const Product=require('../models/product')

const amqp=require('amqplib')
const jwt=require('jsonwebtoken')

let order,connection,channel:any,userDetails

const rabbitMqUrl='amqp://localhost:5672'
const exchangeName="product-orders"

async function connectToRabbitMq() {
    connection=await amqp.connect(rabbitMqUrl)
    channel=await connection.createChannel()
    await channel.assertExchange(exchangeName, 'direct', { durable: true }); 
}
connectToRabbitMq()

const authenticate = async (req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization?.split(' ')[1]
    if(!token) return res.status(401).send({message:'Not authorized'})        
     jwt.verify(token,'Rashid',(err:Error)=>{
      if(err)
      {
        return res.status(401).json({message:err})
      }else
      {
        next()
      }
    })
}
router.post('/',authenticate,async(req:Request,res:Response)=>{
    const {name,price,description}=await req.body
    if(!name || !price || !description)
    {
        return res.status(400).json({
            message:"provide name price and desc"
        })
    }else{
        const product=await new Product({...req.body})
        await product.save()
        console.log(product);
        return res.status(201).json({
            message:"product created succesfully",
            product
        })
    }
})

router.post('/buy',authenticate,async(req:Request,res:Response)=>{
    try {
        const {productsId}=req.body;
        const products=await Product.find({_id:{$in:productsId}}); 
        const routingKey = 'order.create';  
        await channel.publish(exchangeName,routingKey,Buffer.from(JSON.stringify({products})))
        return res.status(201).json({
            message:"Order request placed succesfully",
            products
        })
    } catch (error) {
        console.log(error);
        
    }
})



export default router