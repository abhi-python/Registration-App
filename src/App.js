import React from "react";
import "./App.css";
import UserRegistrationForm from "./components/UserRegistrationForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDetails from "./components/UserDetails";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRegistrationForm />} />
        <Route path="userdetails" element={<UserDetails />} />
      </Routes>
    </BrowserRouter>
      
      
    </>
  );
}

export default App;
