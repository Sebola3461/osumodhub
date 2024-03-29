import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
import Home from "./pages/Home";
import Queue from "./pages/Queue";
import AuthProvider from "./providers/AuthContext";
import { UserSideMenuProvider } from "./providers/UserSideMenu";
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
import { HomeFilterContextProvider } from "./providers/HomeFiltersContext";
import GDFeed from "./pages/GDFeed";
import RedirectHome from "./components/global/RedirectHome";
import { PostGDPanelProvider } from "./providers/PostGDPanelContext";
import { GDPanelProvider } from "./providers/GDPanelContext";
import { ManageGDPanelProvider } from "./providers/ManageGDPanelContext";
import { ConfirmDialogProvider } from "./providers/ConfirmDialogContext";
import { RequestWsProvider } from "./providers/RequestWsQueueContext";
import { QueueProvider } from "./providers/QueueContext";
import { QueueGroupsSideMenuProvider } from "./providers/QueueGroupsSideMenu";
import { CreateGroupPanelProvider } from "./providers/CreateGroupContext";
import AudioPlayer from "./components/global/AudioPlayer";

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
      <AuthProvider>
        <QueueProvider>
          <QueueGroupsSideMenuProvider>
            <CreateGroupPanelProvider>
              <UserSideMenuProvider>
                <ConfirmDialogProvider>
                  <QueuePanelProvider>
                    <RequestWsProvider>
                      <RequestContextProvider>
                        <RequestPanelProvider>
                          <ManageRequestPanelProvider>
                            <MyRequestsPanelProvider>
                              <BeatmapPreviewProvider>
                                <NotificationSideMenuProvider>
                                  <HomeFilterContextProvider>
                                    <PostGDPanelProvider>
                                      <GDPanelProvider>
                                        <ManageGDPanelProvider>
                                          <BrowserRouter>
                                            <Routes>
                                              <Route
                                                path="/"
                                                element={<RedirectHome />}
                                              >
                                                <Route
                                                  index
                                                  element={<RedirectHome />}
                                                />
                                              </Route>
                                              <Route
                                                path="/modding"
                                                element={<Home />}
                                              >
                                                <Route
                                                  index
                                                  element={<Home />}
                                                />
                                              </Route>
                                              <Route
                                                path="/gd"
                                                element={<GDFeed />}
                                              >
                                                <Route
                                                  index
                                                  element={<GDFeed />}
                                                />
                                                cmd
                                              </Route>
                                              <Route
                                                path="/queue/:user"
                                                element={<Queue />}
                                              >
                                                <Route
                                                  index
                                                  element={<Queue />}
                                                />
                                              </Route>
                                            </Routes>
                                          </BrowserRouter>
                                          <AudioPlayer />
                                        </ManageGDPanelProvider>
                                      </GDPanelProvider>
                                    </PostGDPanelProvider>
                                  </HomeFilterContextProvider>
                                </NotificationSideMenuProvider>
                              </BeatmapPreviewProvider>
                            </MyRequestsPanelProvider>
                          </ManageRequestPanelProvider>
                        </RequestPanelProvider>
                      </RequestContextProvider>
                    </RequestWsProvider>
                  </QueuePanelProvider>
                </ConfirmDialogProvider>
              </UserSideMenuProvider>
            </CreateGroupPanelProvider>
          </QueueGroupsSideMenuProvider>
        </QueueProvider>
      </AuthProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
