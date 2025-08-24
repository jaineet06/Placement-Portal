import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AdminContextProvider } from "./context/AdminContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <App />
    </AdminContextProvider>
  </BrowserRouter>
);
