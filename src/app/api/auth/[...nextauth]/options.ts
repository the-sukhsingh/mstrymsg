import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                identifier:{
                    label: "Identifier",
                    type: "text",
                },
                password:{
                    label: "Password",
                    type: "password",
                    placeholder: "Password"
                }
            },
            async authorize(credentials: any):Promise<any>{
                if (!credentials) return null;
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found')
                    }
                    if(!user.isVerified){
                        throw new Error('User not verified')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(!isPasswordCorrect){
                        throw new Error('Password incorrect')
                    }

                    return user

                } catch (error: Error | unknown) {
                    throw new Error(error instanceof Error ? error.message : 'An error occurred')
                }
            }
        })
    ],
    callbacks:{
        async session({session,token}){
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        }
},
    pages:{
        signIn: "/sign-in"
    },
    session:{
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET
}