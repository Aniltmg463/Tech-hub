import userModel from "../models/userModel.js";
//import { hashPasssword, hashPasssword } from './../helpers/authHelper.js';
import { hashPassword } from "./../helpers/authHelper.js";

export const registerController = async(req,res) => {
    try{
        const {name,email,password,phone,address} = req.body
        //validation
        if(!name){
            return res.send({error:'Name is required'})
        }
        if(!email){
            return res.send({error:'Email is required'})
        }
        if(!password){
            return res.send({error:'Password is required'})
        }
        if(!phone){
            return res.send({error:'Phone is required'})
        }
        if(!address){
            return res.send({error:'Address is required'})
        }
        //check user
        const existingUser = await userModel.findOne({email})
        //existing user
        if(existingUser){
            return res.status(200).send({
                success:true,
                message:'Already Register please login',
            })
        }

        //register user
        //const hashPasssword = await hashPasssword(password)
        const hashedPassword = await hashPassword(password);

        //save
        const user =await new userModel({name,email,password:hashedPassword,phone,address}).save()

        res.status(201).send({
            success:true,
            message:'User Register Successfully',
            user
        })
    } catch (eror) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }
};


// const registerController = () => {};
// export default {registerController};