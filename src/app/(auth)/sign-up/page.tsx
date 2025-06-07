"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernamUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          console.log("response is ", response);
          console.log("data is ", response.data);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "An error occurred"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernamUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    console.log("submit data is ", data);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);      toast({
        title: "🎯 Agent Recruited",
        description: "Welcome to the mystery network. Proceed to secure login.",
        variant: "success",
      });

      router.replace(`/sign-in`);
    } catch (error) {
      console.log("error in sign-up page is ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "🚫 Recruitment Failed",
        description: axiosError.response?.data.message || "Unable to establish secure identity",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      
      <div className="relative w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Mystery
          </Link>
        </div>

        {/* Main Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-2xl "></div>
          <div className="relative p-8 bg-slate-800/40  border border-slate-700/50 rounded-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
                <span className="text-2xl">🕶️</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-thin text-white mb-3 tracking-tight">
                Join the Mystery
              </h1>
              <p className="text-slate-300 text-lg">Begin your anonymous journey</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 font-medium">Choose Your Alias</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter a mysterious username..."
                            className="bg-slate-900/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-slate-400 focus:ring-slate-400 rounded-lg h-12"
                            {...field}
                            onChange={(e) => {
                              debounced(e.target.value);
                              field.onChange(e);
                            }}
                          />
                          {isCheckingUsername && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Loader2 className="animate-spin h-4 w-4 text-slate-400" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      {usernameMessage && (
                        <div className="flex items-center mt-2">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            usernameMessage === "Username is unique" ? "bg-green-500" : "bg-red-500"
                          }`}></div>
                          <p className={`text-sm ${
                            usernameMessage === "Username is unique" ? "text-green-400" : "text-red-400"
                          }`}>
                            {usernameMessage}
                          </p>
                        </div>
                      )}
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 font-medium">Secret Contact</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your.secret@email.com" 
                          className="bg-slate-900/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-slate-400 focus:ring-slate-400 rounded-lg h-12"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 font-medium">Master Key</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Create a strong password..." 
                          className="bg-slate-900/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-slate-400 focus:ring-slate-400 rounded-lg h-12"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 h-12 text-lg font-medium rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Entering the Mystery...
                    </>
                  ) : (
                    "Enter the Mystery"
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="flex-1 h-px bg-slate-700"></div>
                <span className="text-slate-500 text-sm">Already part of the mystery?</span>
                <div className="flex-1 h-px bg-slate-700"></div>
              </div>
              <Link 
                href="/sign-in" 
                className="text-slate-300 hover:text-white transition-colors duration-200 underline underline-offset-4"
              >
                Sign In to Continue
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <div className="flex items-center justify-center space-x-6 text-slate-500 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Anonymous</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
