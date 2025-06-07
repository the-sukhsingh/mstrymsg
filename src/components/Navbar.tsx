"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { LogOut, UserCircle } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();

  const user = session?.user as User;

  return (
    <nav className="sticky top-0 z-50  bg-slate-900/80 border-b border-slate-700/50">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90"></div>
      <div className="relative container mx-auto px-4 md:px-6 py-4">
        <div className="flex md:flex-row justify-between items-center gap-4">
          {/* Brand Section */}
          <Link href="/" className="group flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-lg  transition-all duration-300"></div>
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-slate-600/50">
                <span className="text-xl">🕶️</span>
              </div>
            </div>
            <div className="text-xl font-thin text-white tracking-wide">
              Mystery Messages
            </div>
          </Link>

          {/* User Section */}
          {session ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-slate-300">
                <UserCircle className="h-4 w-4" />
                <span className="text-sm font-light">
                  {user?.username || user?.email}
                </span>
              </div>
              <Button
                onClick={() => signOut()}
                variant="outline"
                size="sm"
                className="bg-slate-800/50 border-slate-600/50 text-slate-200 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:block">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
