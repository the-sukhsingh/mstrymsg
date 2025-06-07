"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";

export default function Home() {
  const features = [
    {
      title: "Anonymous Feedback",
      description: "Receive honest thoughts without revealing identities. Sometimes the most valuable insights come from the shadows.",
      icon: "🎭"
    },
    {
      title: "Secure & Private",
      description: "Your secrets are safe with us. Messages disappear like whispers in the night, leaving no trace behind.",
      icon: "🔒"
    },
    {
      title: "Share Freely",
      description: "Express yourself without fear of judgment. In anonymity, we find the courage to speak our truth.",
      icon: "💭"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">



      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
              <span className="text-3xl">🕶️</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-thin text-white mb-4 tracking-tight">
              Mystery
              <span className="block text-slate-400 text-4xl md:text-6xl mt-2">Messages</span>
            </h1>
          </div>

          {/* Main Tagline */}
          <div className="space-y-4 mb-16">
            <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
              Where your identity remains a mystery
            </p>
            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
              Share thoughts, receive feedback, and connect authentically—all while staying completely anonymous.
            </p>
          </div>

          {/* CTA Button */}
          <div className="">
            <Link href={"/sign-up"}>
              <Button 
                size="lg" 
                className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Enter the Mystery
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Carousel */}
        <div className="w-full max-w-2xl mx-auto mt-6">
          <Carousel
            className="relative w-full"
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
              }),
            ]}
          >
            <CarouselContent className="-ml-4">
              {features.map((feature, index) => (
                <CarouselItem key={index} className="pl-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-2xl transition-all duration-300"></div>
                    <div className="relative p-8 bg-slate-800/40  border border-slate-700/50 rounded-2xl hover:bg-slate-800/60 transition-all duration-300">
                      <div className="text-center space-y-4">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-2xl font-light text-white mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-lg">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 text-white" />
            <CarouselNext className="hidden md:flex -right-12 bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 text-white" />
          </Carousel>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {features.map((_, index) => (
              <div 
                key={index} 
                className="w-2 h-2 rounded-full bg-slate-600 opacity-50"
              ></div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 text-center space-y-4">
          <p className="text-slate-500 text-sm">
            Join thousands who trust us with their secrets
          </p>
          <div className="flex items-center justify-center space-x-6 text-slate-600">
            <span className="text-xs">Completely Anonymous</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
            <span className="text-xs">End-to-End Encrypted</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
            <span className="text-xs">No Data Stored</span>
          </div>
        </div>
      </div>
    </div>
    
  );
}
