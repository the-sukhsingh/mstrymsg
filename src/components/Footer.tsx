import React from 'react';
import Link from 'next/link';
import {Shield, Heart } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-black border-t border-slate-700/50">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">

          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg "></div>
                <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-slate-600/50">
                  <span className="text-lg sm:text-xl">🕶️</span>
                </div>
              </div>
              <div className="text-lg sm:text-xl font-thin text-white tracking-wide">
                Mystery Messages
              </div>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Share anonymous messages securely. Enter the mystery, stay hidden, communicate freely.
            </p>
          </div>

          <div className='flex items-start justify-between w-full '>

            {/* Links Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-white font-medium tracking-wide text-sm sm:text-base">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-slate-400 hover:text-white text-xs sm:text-sm transition-colors">
                  Dashboard
                </Link>
                <Link href="/u/anonymous" className="block text-slate-400 hover:text-white text-xs sm:text-sm transition-colors">
                  Send Message
                </Link>
                <Link href="/sign-up" className="block text-slate-400 hover:text-white text-xs sm:text-sm transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
            {/* Contact & Social */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-white font-medium tracking-wide text-sm sm:text-base">Connect</h3>
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="https://github.com/the-sukhsingh/mstrymsg"
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9  rounded-lg transition-all duration-300 hover:scale-105"
                  aria-label="GitHub"
                >
                  <svg role="img" viewBox="0 0 24 24" fill='white' xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>                
                  </Link>
                <Link
                  href="mailto:sukhaji65@gmail.com"
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9  rounded-lg transition-all duration-300 hover:scale-105"
                  aria-label="Mail"
                >
                  <svg role="img" viewBox="0 0 24 24" fill='white' xmlns="http://www.w3.org/2000/svg"><title>Gmail</title><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg>                
                  </Link>
                
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Shield className="h-3 w-3 flex-shrink-0" />
                <span>Privacy-first messaging</span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-slate-500 text-xs sm:text-sm text-center sm:text-left">
              <span>© {new Date().getFullYear()} Mystery Messages.</span>
              <div className="flex items-center gap-1 sm:gap-2">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-red-400 flex-shrink-0" />
                <span>for anonymous communication.</span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 sm:gap-6  text-slate-500 text-xs">
              <Link href="#" className="hover:text-slate-300 transition-colors whitespace-nowrap">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-300 transition-colors whitespace-nowrap">Terms of Service</Link>
              <Link href="#" className="hover:text-slate-300 transition-colors whitespace-nowrap">Help</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer
