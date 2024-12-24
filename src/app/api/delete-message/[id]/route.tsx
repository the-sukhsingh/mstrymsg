import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";


export async function DELETE(request: Request,{ params }: { params: Promise<{ id: string }>}) {
    await dbConnect();
    const id = (await params).id;
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
          const user = await UserModel.findByIdAndUpdate(
                userId,
                {
                    $pull: {
                        messages: {
                            _id: id
                        }
                    }
                },
                { new: true }
          )
          if (!user || user.length === 0) {
            return Response.json(
              {
                success: false,
                message: "User not found",
              },
              {
                status: 404,
              }
            );
          }
            return Response.json(
                {
                success: true,
                message: "Message deleted",
                user,
                },
                {
                status: 200,
                }
            );
          
      } catch (error) {
            console.error("ERROR in delete-message DELETE", error);
            return Response.json(
                {
                    success: false,
                    message: "Error deleting message"
                },
                {
                    status: 500
                }
            )
      }

}