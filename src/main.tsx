import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./App.css";
import Root from "./routes/root";
import RollForward from "./routes/roll-forward";

// Global Config Loader Component if we want to load in any state
const AppWithConfig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const router = createBrowserRouter([
  { path: "/", element: <Root /> },
  { path: "/roll-forward", element: <RollForward /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppWithConfig>
      <RouterProvider router={router} />
    </AppWithConfig>
  </React.StrictMode>
);
