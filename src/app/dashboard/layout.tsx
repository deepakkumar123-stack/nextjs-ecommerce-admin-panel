import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* <aside className="w-64 bg-gray-100 p-6 rounded-md">
        <nav className="space-y-4">
          <Link href="/dashboard" className="block text-blue-600 font-semibold">
            Dashboard Home
          </Link>
          <Link
            href="/dashboard/editor"
            className="block text-blue-600 font-semibold"
          >
            Editor
          </Link>
          <Link href="/dashboard/profile" className="block">
            Profile
          </Link>
          <Link href="/dashboard/settings" className="block">
            Settings
          </Link>
          <Link href="/dashboard/blog" className="block">
            Blog
          </Link>
        </nav>
      </aside> */}
      {/* Main content (children routes render here) */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
