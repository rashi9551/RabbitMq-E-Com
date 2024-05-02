const Router =require('express').Router
const router=new Router()
import { Application, NextFunction, Request, Response } from 'express'
import amqp from 'amqplib'
import  Order from '../models/order'
import { log } from 'console'


let order,connection:any,channel:any;
const queueName = 'order-processing-queue'; 
const exchangeName="product-orders"
async function connectToRabbitMq() {
    try {
        const rabbitMqUrl='amqp://localhost:5672';
        connection=await amqp.connect(rabbitMqUrl)
        channel=await connection.createChannel()
        await channel.assertQueue(queueName,{durable:true})
        await channel.bindQueue(queueName,exchangeName,'order.create')
        console.log("connected to rabbitMq");
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}
connectToRabbitMq()
let createOrder = (products:any)=>{
    let total = 0;
    products.forEach((product:any)=>{
        total += product.price
    })
    order = new Order({
        products,total
    })
    order.save()
    return order
}

(async()=>{
    const connected=await connectToRabbitMq();
    console.log(connected);
    
    if(connected){
        channel.consume(queueName,(data:any)=>{
            const {products} = JSON.parse(data.content.toString());
            const newOrder=createOrder(products);
            console.log(JSON.parse(data.content.toString()));
            console.log("order placed");
            channel.ack(data)
        })
    }else{
        console.error('cannot consume messages from RabbitMQ due to connection error.');
        
    }
})()

export default router