"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 ">
      <div className="max-w- mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* Left Side (optional logo or blank space for balance) */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-lg font-semibold text-neutral-800"
          ></Link>
        </div>

        {/* Right Side (Profile Image) */}
        <Link href="/profile" className="flex items-center">
          <img
            className="w-10 h-10 p-1 rounded-full border border-transparent hover:border-green-400 transition-all duration-300 cursor-pointer object-cover"
            src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170"
            alt="Profile"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
