import "bulma/css/bulma.css";
import "./style.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";

const root = createRoot(document.getElementById("root"));
root.render(<App />);