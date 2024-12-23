import React from "react";
import { Navigate } from "react-router-dom";

import Home from "../components/home";
import Login from "../components/Login";
import AuthGuard from "../guards/authGaurd";
import FullLayout from "../components/FullLayout";

const Router = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <FullLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/", element: <Navigate to="/home" /> },
      { path: "/home", exact: true, element: <Home /> },
    ],
  },
  {
    path: "/auth",
    children: [{ path: "/auth/login", element: <Login /> }],
  },
];

export default Router;
