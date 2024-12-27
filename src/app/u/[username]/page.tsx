"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import * as z from "zod";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const dummyMessages = [
  "What is your favorite color?",
  "Do you have any pets?",
  "What is your dream job?",
];

const PublicPage = () => {
  const params = useParams();
  const username = params.username;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGettingMessages, setIsGettingMessages] = useState<boolean>(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const { toast } = useToast();

  const messageContainer = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".message-body",
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2,
          ease: "power2.out",
        }
      );
    },
    { scope: messageContainer, dependencies: [suggestedMessages] }
  );

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      username: username,
      content: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username,
        content: data.content,
      });

      if (response.data.success) {
        toast({
          title: "Message Sent",
          description: response.data.message,
          variant: "success",
          duration: 5000,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Error",
        description: axiosError.response?.data.message || axiosError.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  };

  const handleSuggestMessageRequest = async () => {
    setIsGettingMessages(true);
    const response = await axios.post<ApiResponse & { messages: string }>(
      `/api/suggest-messages`
    );

    if (response.data.success) {
      const messages =
        response.data.message?.split("| |").map((msg) => msg.trim()) || [];
      setSuggestedMessages(messages);
      setIsGettingMessages(false);
    } else {
      toast({
        title: "Error",
        description: response.data.message,
        variant: "destructive",
      });
      setIsGettingMessages(false);
    }
  };

  useEffect(() => {
    if (dummyMessages.length > 0) {
      setSuggestedMessages(dummyMessages);
    }

    document.title = `Send message to @${username} | Mystry Message`;


  }, []);

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full md:max-w-6xl min-h-screen flex flex-col gap-4">
      <div className="w-full flex flex-col justify-center items-center gap-6">
        <h1 className="text-2xl md:text-5xl font-extrabold">
          Public Profile Link
        </h1>
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 w-full flex flex-col "
            >
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Send Anonymous Message to @{username}{" "}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" /> Sending
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="w-full flex flex-col justify-start gap-6">
        <Button
          onClick={() => handleSuggestMessageRequest()}
          disabled={isGettingMessages}
          className="mx-auto"
        >
          {isGettingMessages ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> Generating
            </>
          ) : (
            "Generate Suggested Messages"
          )}
        </Button>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4" ref={messageContainer}>
              {suggestedMessages.map((message, index) => (
                <CardDescription
                  key={index}
                  onClick={() => {
                    form.setValue("content", message);
                    if (form.formState.errors.content) {
                      form.clearErrors("content");
                    } else {
                      form.trigger("content");
                    }
                  }}
                  className="cursor-pointer p-4 border border-gray-200 rounded text-black text-sm text-center font-semibold message-body"
                >
                  {message}
                </CardDescription>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="w-full text-center flex flex-col justify-center items-center gap-4">
        <p className="text-lg font-bold">Get Your Message Board</p>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default PublicPage;
