import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod';
import { userNameValidaton } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: userNameValidaton
})


export async function GET(request: Request)
{
    await dbConnect()
    try {
        
        const {searchParams} = new URL(request.url)

        const queryParams = {
            username: searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParams)

        if(!result.success){
            const usernameError = result.error.errors[0].message
            return Response.json({
                success: false,
                message: usernameError
            },{
                status: 400
            })
        }

        const {username} = result.data
        const User = await UserModel.findOne({
            username,
            isVerified: true
        })

        console.log("User in check username unique is ", User)

        if (User.isAcceptingMessages){
            return Response.json({
                success: true,
                message: "User is Accepting messages",
                isAcceptingMessages: User.isAcceptingMessages
            },{
                status: 200
            })
        }

        return Response.json({
            success: false,
            message: "User is not available",
            isAcceptingMessages: false
        },{
            status: 200
        })
    

    } catch (error) {
        console.error("ERROR in check-username-unique GET", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        },{
            status: 500
        })
        
    }
}