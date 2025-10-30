"use client";

import routes from "@/@config/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-white text-neutral-800 w-64 min-h-screen p-6 hidden md:flex flex-col justify-between shadow-md ">
      <div>
        {/* Logo */}
        <div className="text-2xl font-bold mb-8 px-2">
          <Link href="/" className="hover:text-primary transition-colors">
            MyLogo
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2 px-2">
          {routes?.map((item, index) => {
            const isActive = pathname === `/dashboard${item.link}`;
            return (
              <Link
                href={`/dashboard${item.link}`}
                key={index}
                className={`text-base font-medium rounded-md px-2 py-2 transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-neutral-700 hover:bg-neutral-100 "
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Section (optional) */}
      <div className="text-sm text-neutral-500 px-2">
        © {new Date().getFullYear()} MyApp
      </div>
    </aside>
  );
};

export default Sidebar;
