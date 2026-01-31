import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SimulationProvider } from "./state/simulations.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SimulationProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
      />
      <App />
    </SimulationProvider>
  </StrictMode>,
);
