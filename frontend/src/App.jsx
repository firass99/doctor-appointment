import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState } from "react";
import HomePage from "./components/pages/(guest)/HomePage";
import AboutPage from "./components/pages/(guest)/AboutPage";
import DoctorsPage from "./components/pages/(guest)/DoctorsPage";
import LoginPage from "./components/pages/(guest)/LoginPage";
import RegisterPage from "./components/pages/(guest)/RegisterPage";
import TestPage from "./components/pages/(guest)/DepartmentsPage";
import AdminDashboard from "./components/pages/(admin)/AdminDashboard";
import DoctorById from "./components/pages/(guest)/DoctorsDetails";
import HomeLayout from "./components/pages/(guest)/HomeLayout";
import DoctorsDetails from "./components/pages/(guest)/DoctorsDetails";
import DepartmentsPage from "./components/pages/(guest)/DepartmentsPage";
import ContactPage from "./components/pages/(guest)/ContactPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<HomeLayout />}>
            {"HOME PAGES"}
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="contact" element={<ContactPage />} />

            {"DOCTORS PAGES"}
            <Route path="doctors">
              <Route index element={<DoctorsPage />} />
              <Route path=":id" element={<DoctorsDetails />} />
              <Route />
            </Route>
          </Route>

          {"ADMIN PAGES"}
          <Route path="admin">
            <Route index element={<AdminDashboard />} />
          </Route>
          {""}
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
