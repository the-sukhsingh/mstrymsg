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
  const [isUserReceivingMessages, setIsUserReceivingMessages] = useState<boolean>(false);

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
          title: "📡 Message Transmitted",
          description: "Your anonymous message has been securely delivered",
          variant: "success",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;      
      toast({
        title: "🚨 Transmission Failed",
        description: axiosError.response?.data.message || "Unable to deliver anonymous message",
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
      setIsGettingMessages(false);    } else {
      toast({
        title: "🤖 AI Assistant Offline",
        description: "Unable to generate message suggestions at this time",
        variant: "warning",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full  animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full  animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-500/5 rounded-full  animate-pulse delay-500"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 md:py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/30 rounded-full  animate-pulse"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full flex items-center justify-center border border-green-400/30">
                <span className="text-2xl">🕶️</span>
              </div>
            </div>
            <div>
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-white text-3xl md:text-5xl font-thin tracking-wide">
                Anonymous Transmission
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-green-400"></div>
                <span className="text-green-400 text-sm font-medium tracking-wider">SECURE CHANNEL</span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-green-400"></div>
              </div>
            </div>
          </div>

          <div className="relative inline-block">
            <div className="absolute inset-0 bg-slate-800/50 rounded-2xl"></div>
            <div className="relative bg-slate-800/30  border border-slate-600/30 rounded-2xl px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300 text-lg">Target: <span className="text-blue-400 font-medium">@{username}</span></span>
                
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Left Column - Message Form */}
          <div className="xl:col-span-2 space-y-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl  transition-all duration-500"></div>
              <div className="relative bg-slate-800/40 border border-slate-600/30 rounded-3xl p-8 hover:border-slate-500/50 transition-all duration-300">
                
                {/* Form Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-slate-600/30">
                    <span className="text-lg">📝</span>
                  </div>
                  <div>
                    <h2 className="text-slate-200 text-xl font-medium">Compose Message</h2>
                    <p className="text-slate-400 text-sm">Your identity remains completely anonymous</p>
                  </div>
                </div>

                {/* Message Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                      name="content"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 text-base font-medium">
                            Encrypted Message Content
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Type your anonymous message here... Your words will be encrypted and transmitted securely."
                                className="min-h-32 bg-slate-900/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500 resize-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                                {...field}
                              />
                              <div className="absolute bottom-3 right-3 text-slate-500 text-xs">
                                {field.value?.length || 0} characters
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !form.formState.isValid}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 h-12 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            Transmitting...
                          </>
                        ) : (
                          <>
                            <span className="mr-2">📡</span>
                            Send Anonymous Message
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSuggestMessageRequest}
                        disabled={isGettingMessages}
                        className="bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-700 hover:border-slate-500 h-12 rounded-xl transition-all duration-300"
                      >
                        {isGettingMessages ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <span className="mr-2">🤖</span>
                            AI Suggestions
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>

          {/* Suggestions Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl transition-all duration-500"></div>
            <div className="relative bg-slate-800/40  border border-slate-600/30 rounded-3xl p-6 hover:border-slate-500/50 transition-all duration-300">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                  <span className="text-sm">💡</span>
                </div>
                <div>
                  <h3 className="text-slate-200 font-medium">Message Ideas</h3>
                  <p className="text-slate-400 text-xs">Tap any suggestion to use it</p>
                </div>
              </div>

              <div className="space-y-3" ref={messageContainer}>
                {suggestedMessages.map((message, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      form.setValue("content", message);
                      if (form.formState.errors.content) {
                        form.clearErrors("content");
                      } else {
                        form.trigger("content");
                      }
                    }}
                    className="message-body group/item cursor-pointer p-4 bg-slate-900/50 hover:bg-slate-900/70 border border-slate-700/50 hover:border-slate-600/50 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <p className="text-slate-300 text-sm leading-relaxed group-hover/item:text-white transition-colors">
                      {message}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/30">
                      <span className="text-slate-500 text-xs">Click to use</span>
                      <div className="w-2 h-2 bg-green-400/50 rounded-full group-hover/item:bg-green-400 transition-colors"></div>
                    </div>
                  </div>
                ))}

                {suggestedMessages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl opacity-50">💭</span>
                    </div>
                    <p className="text-slate-400 text-sm">No suggestions yet</p>
                    <p className="text-slate-500 text-xs mt-1">Use AI to generate ideas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative group mt-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl  transition-all duration-500"></div>
          <div className="relative bg-slate-800/40  border border-slate-600/30 rounded-3xl p-6 text-center hover:border-slate-500/50 transition-all duration-300">

            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <span className="text-xl">🚀</span>
            </div>

            <h3 className="text-slate-200 font-medium mb-2">Start Your Own Mystery</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Create your anonymous message board and receive secret messages from others
            </p>

            <Link href="/sign-up">
              <Button className=" px-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 h-10 font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="mr-2">✨</span>
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/30  border border-slate-600/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-400 text-sm">End-to-end encrypted • Completely anonymous • No tracking</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPage;
