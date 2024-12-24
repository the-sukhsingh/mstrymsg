import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to:email,
            subject:"MystryMessage Verification Code",
            react:VerificationEmail({username:username, otp:verifyCode}),
        })
        return {
            success: true,
            message: "Verification email sent",
        };
    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return {
            success: false,
            message: "Error sending verification email",
        };
    }
}