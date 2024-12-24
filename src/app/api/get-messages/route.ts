import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const userMessages = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            { 
                $unwind: "$messages"
            },
            {
                $sort:{'messages.createdAt': -1}
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            }
        ])
        if(!userMessages){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }
        if(userMessages.length === 0){
            return Response.json(
                {
                    success: true,
                    message: "No messages found",
                    messages: []
                },
                {
                    status: 200
                }
            )
        }

        return Response.json(
            {
                success: true,
                messages: userMessages[0].messages
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.error("ERROR in get-messages GET", error);
        return Response.json(
            {
                success: false,
                message: "Error fetching messages"
            },
            {
                status: 500
            })
    }
}