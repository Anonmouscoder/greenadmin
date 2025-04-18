// src/utils/CheckAuth.js
import React from "react";
import { Navigate } from "react-router-dom";

const CheckAuth = ({ children }) => {
  const user = sessionStorage.getItem("admin"); // ✅ FIXED
//   console.log("CheckAuth -> user:", user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default CheckAuth;
