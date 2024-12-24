"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  const user = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-slate-950 text-white sticky top-0 z-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-xl font-bold mb-4 md:mb-0" href={"/"}>
          Mystry Messages
        </a>
        {session ? (
          <div>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              className="md:w-auto bg-slate-100 text-black hover:text-white"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Link href={"/sign-in"}>
            <Button className="w-full md:w-auto bg-slate-100 text-black hover:text-white">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
