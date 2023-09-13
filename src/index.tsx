import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter> {/* HashRouter é rota com # ex: google.com#/rota-aqui*/}
      <App />
    </HashRouter>
  </React.StrictMode>
);
