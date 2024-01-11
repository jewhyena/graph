import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="bg-[#101010] flex flex-col h-screen w-full justify-center items-center">
      <div className="bg-[#1b1b1b] max-w-[600px] w-full pl-6 pr-2.5 pt-6 rounded-2xl">
        <p className="text-lg font-semibold text-white -mb-3">Engagement</p>
        <div className="h-[342px]  rounded-2xl">
          <App />
        </div>
      </div>
    </div>
  </React.StrictMode>
);
