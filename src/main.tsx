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
import { SnackbarProvider } from "notistack";
import { MyRequestsPanelProvider } from "./providers/MyRequestsPanelContext";
import { ManageRequestPanelProvider } from "./providers/ManageRequestPanelContext";
import {
  BeatmapPreviewContext,
  BeatmapPreviewProvider,
} from "./providers/BeatmapPreviewContext";
import { NotificationSideMenuProvider } from "./providers/NotificationSideMenu";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      preventDuplicate
    >
      <SideMenuProvider>
        <AuthProvider>
          <RequestContextProvider>
            <RequestPanelProvider>
              <QueuePanelProvider>
                <ManageRequestPanelProvider>
                  <MyRequestsPanelProvider>
                    <BeatmapPreviewProvider>
                      <NotificationSideMenuProvider>
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
                      </NotificationSideMenuProvider>
                    </BeatmapPreviewProvider>
                  </MyRequestsPanelProvider>
                </ManageRequestPanelProvider>
              </QueuePanelProvider>
            </RequestPanelProvider>
          </RequestContextProvider>
        </AuthProvider>
      </SideMenuProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
