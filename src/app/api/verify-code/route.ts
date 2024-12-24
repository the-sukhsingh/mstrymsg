import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username,code } = await request.json();
        
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodedUsername});

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found',
                },
                {
                    status: 400,
                }
            );
        }

        if(user.isVerified) {
            return Response.json(
                {
                    success: false,
                    message: 'User already verified',
                },
                {
                    status: 400,
                }
            );
        }

        const isValidCode = user.verifyCode === code;
        const isCodeNotExpired = new Date(
            user.verifyCodeExpire
        ) > new Date();
        if(isValidCode && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: 'User verified',
                },
                {
                    status: 200,
                }
            );
        }else if (!isValidCode) {
            return Response.json(
                {
                    success: false,
                    message: 'Invalid verification code',
                },
                {
                    status: 400,
                }
            );
        }
         else {
            return Response.json(
                {
                    success: false,
                    message: 'Verification code expired',
                },
                {
                    status: 400,
                }
            );
        }
    } catch (error) {
        console.error(error);
        return Response.json(
            {
                success: false,
                message: 'Internal server error',
            },
            {
                status: 500,
            }
        );
    }

}