"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-primary-600 text-white  flex items-center justify-end py-4 px-8 md:px-20 shadow-md sticky top-0 z-50">
      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6 text-lg font-medium">
        <Link href="/" className="hover:text-primary-200 transition-colors">
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
