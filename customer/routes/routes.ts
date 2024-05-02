const Router =require('express').Router
import { Application, NextFunction, Request, Response } from 'express'
const router=new Router()
const User=require('../models/user')
const jwt=require('jsonwebtoken')

function verify(req:Request,res:Response,next:NextFunction)
{
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        let user=jwt.verify(token, 'Rashid')
        console.log(user);
        next()
    }else{
        return res.json("unauthoeised request")
    }
}
router.post('/signout',verify,async(req:Request,res:Response)=>{
    return res.status(200).send({"message":"user signed out successfully!"})
})

router.post('/signup',async(req:Request,res:Response)=>{
    const{email,password}=req.body
    if(!email ||!password)return console.log('Enter email and Password');
    const user=await new User({email,password})
    await user.save()

    return res.status(201).send({user})
    
})

router.post('/signin',async(req:Request,res:Response)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(user?.password===password)
    {        
        const userJWT=jwt.sign({
            id:user._id,
            email:user.email
        },'Rashid')
        return res.status(201).send({message:'log in success',userJWT})
    }else{
        return res.send("incorrect credentials")
    }

})
module.exports=router