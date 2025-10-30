import Navbar from "@/components/layout/NavBar";
import Sidebar from "@/components/layout/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex min-h-screen">
      {/* Main layout */}

      {/* Sidebar on desktop */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 bg-neutral-200 text-foreground  min-h-screen">
        <Navbar />
        <div className="p-6">{children}</div>
        {/* <Footer /> */}
      </main>
    </div>
  );
}
