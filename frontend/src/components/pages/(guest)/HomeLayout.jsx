import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
