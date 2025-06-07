"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import {  useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {toast} = useToast()
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    console.log("submit data is ", data);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })
    console.log("result in sign in is ", result)
    setIsSubmitting(false);    if(result?.error){
      toast({
        title: "🔐 Access Denied",
        description: "Invalid credentials. Check your alias and master key.",
        variant: "destructive",
      })
    }

    if(result?.url){
      router.replace("/dashboard")
    }

  };  return (
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
                Welcome Back
              </h1>
              <p className="text-slate-300 text-lg">Return to the shadows</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 font-medium">Your Identity</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Username or email..." 
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
                          placeholder="Enter your secret key..." 
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
                <span className="text-slate-500 text-sm">New to the mystery?</span>
                <div className="flex-1 h-px bg-slate-700"></div>
              </div>
              <Link 
                href="/sign-up" 
                className="text-slate-300 hover:text-white transition-colors duration-200 underline underline-offset-4"
              >
                Join the Mystery
              </Link>
            </div>

            {/* Quick Access Info */}
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-3">Quick & Secure Access</p>
                <div className="flex items-center justify-center space-x-6 text-slate-500 text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Instant Login</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Stay Anonymous</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage
