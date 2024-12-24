import dbConnect from "@/lib/dbConnect";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST() {
  await dbConnect();
  const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by ' | |'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? | | If you could have dinner with any historical figure, who would it be?| | What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try{
  const { text } = await generateText({
    model: google("gemini-1.5-pro-latest"),
    prompt,
  });

    return Response.json(
        {
        success: true,
        message: text,
        },
        {
        status: 200,
        }
    );
  }
  catch (error) {
    console.log(error)
    return Response.json(
        {
        success: false,
        message: error,
        },
        {
        status: 500,
        }
    );
  }
}
