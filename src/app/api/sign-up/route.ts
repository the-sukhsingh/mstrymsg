import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"

export async function POST(request:Request)
{
    await dbConnect()
    try {
        const {username, email, password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername)
        {
            return Response.json({
                success: false,
                message: "Username already exists"
            },{
                status: 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString() 
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email already exists"
                },{
                    status: 400
                })
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpire = new Date(
                    new Date().setHours(new Date().getHours() + 1)
                )
                await existingUserByEmail.save()
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
              username,
              email,
              password: hashedPassword,
              verifyCode,
              verifyCodeExpire: expiryDate,
              isVerified: true,
              isAcceptingMessages: true,
              messages: [],
            });
            await newUser.save()
        }


        
        return Response.json({
            success: true,
            message: "User Registered Successfully. Please Sign In."
        },{
            status: 201
        })

    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: "An error occurred while signing up"
        },{
            status: 500
        })
    }
}