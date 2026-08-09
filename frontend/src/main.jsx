// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="1055473579581-r2b19ier5n1q6rl8daia4t8du1e549gg.apps.googleusercontent.com">
      <App />
  </GoogleOAuthProvider>
);