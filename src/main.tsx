import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const data1 = [10, 30, 40, 55, 40, 40, 60, 58, 56, 65, 85, 100].map<
  [number, number]
>((v, i) => [i, v]);

const data2 = [100, 30, 40, 55, 40, 40, 60, 58, 56, 65, 85, 90].map<
  [number, number]
>((v, i) => [i, v]);

const data3 = [60, 30, 10, 55, 40, 120, 60, 50, 56, 65, 85, 50].map<
  [number, number]
>((v, i) => [i, v]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="bg-[#101010] flex flex-col min-h-screen w-full justify-center items-center gap-6 py-6">
      <div className="bg-[#1b1b1b] max-w-[600px] w-full pl-6 pr-2.5 pt-6 rounded-2xl">
        <p className="text-lg font-semibold text-white -mb-3">Engagement</p>
        <div className="h-[342px] rounded-2xl">
          <App data={data1} />
        </div>
      </div>

      <div className="bg-[#1b1b1b] max-w-[600px] w-full pl-6 pr-2.5 pt-6 rounded-2xl">
        <p className="text-lg font-semibold text-white -mb-3">Engagement</p>
        <div className="h-[342px] rounded-2xl">
          <App data={data2} />
        </div>
      </div>

      <div className="bg-[#1b1b1b] max-w-[600px] w-full pl-6 pr-2.5 pt-6 rounded-2xl">
        <p className="text-lg font-semibold text-white -mb-3">Engagement</p>
        <div className="h-[342px] rounded-2xl">
          <App data={data3} />
        </div>
      </div>
    </div>
  </React.StrictMode>
);
