"use client";

import routes from "@/@config/routes";
import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="bg-primary-600 text-white w-64 min-h-screen p-6 hidden md:flex flex-col space-y-6">
      {/* Logo */}
      <div className="text-2xl font-bold mb-8">
        <Link href="/">MyLogo</Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col p-2 space-y-4 text-lg">
        {routes?.map((item, index) => {
          return (
            <Link
              href={`/dashboard${item.link}`} // ✅ use href, not to
              className="hover:text-primary-200 transition-colors"
              key={index}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Optional Footer or Social Links */}
      <div className="mt-auto text-sm">
        &copy; {new Date().getFullYear()} MyCompany
      </div>
    </aside>
  );
};

export default Sidebar;
