import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
import Home from "./pages/Home";
import Queue from "./pages/Queue";
import AuthProvider from "./providers/AuthContext";
import { SideMenuProvider } from "./providers/UserSideMenu";
import { RequestContextProvider } from "./providers/RequestContext";
import { RequestPanelProvider } from "./providers/RequestPanelContext";
import { QueuePanelProvider } from "./providers/QueuePanelContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SideMenuProvider>
      <AuthProvider>
        <RequestContextProvider>
          <RequestPanelProvider>
            <QueuePanelProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />}>
                    <Route index element={<Home />} />
                  </Route>
                  <Route path="/queue/:user" element={<Queue />}>
                    <Route index element={<Queue />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </QueuePanelProvider>
          </RequestPanelProvider>
        </RequestContextProvider>
      </AuthProvider>
    </SideMenuProvider>
  </React.StrictMode>
);
