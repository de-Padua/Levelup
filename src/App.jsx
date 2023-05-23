import { Route, Routes } from "react-router-dom";
import React from "react";
import Login from "./Components/Login.jsx";
import CreateNewAccount from "./Components/CreateNewAccount.jsx";
import Homepage from "./HomePage/HomePage.jsx";
import Apresentation from "./Components/Apresentation.jsx";
import "./index.css";
import { GlobalContextProvider } from "./global-context/context.jsx";

export default function App() {
  document.title = "Level up";
  return (
    <>
      <GlobalContextProvider>
        <Routes>
          <Route path="/" element={<Apresentation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new_account" element={<CreateNewAccount />} />
          <Route path="/homepage/*" element={<Homepage />} />
        </Routes>
      </GlobalContextProvider>
    </>
  );
}
