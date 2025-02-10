import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

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

//POST LOGIN
// LOGIN USER
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Email and password are required",
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered",
            });
        }

        // Check password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).send({
                success: false,
                message: "Invalid password",
            });
        }

        // Check if JWT_SECRET is defined
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the .env file");
        }

        // Generate JWT token
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token,
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error: error.message,
        });
    }
};