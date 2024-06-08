// Import React into the bundle
import React from "react";
import { createRoot } from "react-dom/client";

// Include your index.css file into the bundle
import "../styles/index.css";

// Import Bootstrap icons
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import your own components
import Layout from "./layout";

// Get the root element
const container = document.getElementById("app");

// Create a root
const root = createRoot(container);

// Initial render
root.render(<Layout />);