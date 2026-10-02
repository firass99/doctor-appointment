import Navbar from "@/components/sections/Navbar";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <main className="">
      <Navbar />
      <Outlet />
    </main>
  );
}
