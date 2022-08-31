import React, { useContext, useEffect, useState } from "react";
import AppBar from "../components/global/AppBar";
import HeaderPanel from "../components/global/HeaderPanel";
import PageBanner from "../components/global/PageBanner";
import "./../styles/pages/Queue.css";
import Tag from "../components/global/Tag";
import CatchIcon from "../components/icons/CatchIcon";
import ManiaIcon from "../components/icons/ManiaIcon";
import OsuIcon from "../components/icons/OsuIcon";
import TaikoIcon from "../components/icons/TaikoIcon";
import SearchSelect from "../components/global/SearchSelect";
import RequestSelector, {
  IRequest,
} from "../components/global/RequestSelector";
import NoRequests from "../components/global/NoRequests";
import { AuthContext } from "../providers/AuthContext";
import RequestPanel from "../components/queue/RequestPanel";
import { RequestPanelContext } from "../providers/RequestPanelContext";
import SideMenu from "../components/global/SideMenu";
import { useNavigate } from "react-router-dom";
import { SideMenuContext } from "../providers/UserSideMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faUser,
  faUserLargeSlash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { GenerateComponentKey } from "../helpers/GenerateComponentKey";
import { useSnackbar } from "notistack";
import QueuePanel from "../components/queue/QueuePanel";
import { QueuePanelContext } from "../providers/QueuePanelContext";
import DestroySession from "../helpers/DestroySession";
import SyncQueueData from "../helpers/SyncQueueData";
import CreateNewQueue from "../helpers/CreateNewQueue";
import { MyRequestPanelContext } from "../providers/MyRequestsPanelContext";
import MyRequestsPanel from "../components/global/MyRequestsPanel";
import ManageRequestPanel from "../components/queue/ManageRequestPanel";
import NotificationSideMenu from "../components/global/NotificationSideMenu";
import { NotificationSideMenuContext } from "../providers/NotificationSideMenu";
import { SelectedRequestContextProvider } from "../providers/SelectRequestContext";
import AudioPlayer from "../components/global/AudioPlayer";
import { ManageRequestPanelContext } from "../providers/ManageRequestPanelContext";
import ConfirmDialog from "../components/global/ConfirmDialog";
import Markdown from "markdown-to-jsx";
import { lastManagedRequestContext } from "../providers/LastManagedRequestContext";

export default () => {
  const icons = [
    <OsuIcon color="white" width="1.2rem" height="1.2rem"></OsuIcon>,
    <TaikoIcon color="white" width="1.2rem" height="1.2rem"></TaikoIcon>,
    <CatchIcon color="white" width="1.2rem" height="1.2rem"></CatchIcon>,
    <ManiaIcon color="white" width="1.2rem" height="1.2rem"></ManiaIcon>,
  ];

  const [filters, updateFilters] = useState<{ [key: string]: any }>({
    type: "progress",
    status: "any",
  });

  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const { open, setOpen, setRulesRead } = useContext(RequestPanelContext);
  const sideMenuContext = useContext(SideMenuContext);
  const notificationSideMenuContext = useContext(NotificationSideMenuContext);
  const queuePanelContext = useContext(QueuePanelContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [followers, setFollowers] = useState({ size: 0, mutual: null });
  const [requestToFocus, setRequestToFocus] = useState("");
  const [followButtonIcon, setFollowButtonIcon] = useState(faUser);
  const manageRequestPanel = useContext(ManageRequestPanelContext);
  const [ws, setWs] = useState(
    new WebSocket(
      window.location.hostname == "localhost"
        ? "ws://localhost:3001/"
        : "wss://osumodhub.xyz/ws"
    )
  );

  const { lastManagedRequest, setLastManagedRequest } = useContext(
    lastManagedRequestContext
  );
  const requestsPanelContext = useContext(MyRequestPanelContext);

  const [queue, setQueue] = useState({
    _id: "",
    name: "Loading...",
    allow: {
      graveyard: true,
      wip: true,
    },
    banner: "/src/static/homebanner.png",
    description: "Loading..",
    icon: "",
    modes: [],
    open: false,
    type: "Loading...",
    verified: false,
    country: {
      acronym: "--",
      name: "--",
      flag: "",
    },
    genres: [],
  });

  const typeColors: { [key: string]: string } = {
    modder: "#2196f3",
    BN: "#a347eb",
    NAT: "#eb8c47",
  };

  const [requests, setRequests] = useState<any>(["loading"]);

  useEffect(() => {
    const queue_id = window.location.pathname.split("").pop()
      ? window.location.pathname.split("/").pop()?.trim()
      : "";
    const _targetRequest = new URLSearchParams(location.search).get("r");

    setRulesRead(false);

    if (_targetRequest) {
      setRequestToFocus(_targetRequest);
    }

    fetch(`/api/queues/${queue_id}`)
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        setQueue(q.data);
      });

    fetch(
      `/api/queues/${queue_id}/requests?type=${filters.type}&status=${filters.status}`
    )
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        q.data.sort(
          (a: IRequest, b: IRequest) =>
            new Date(b.date).valueOf() - new Date(a.date).valueOf()
        );

        setRequests(q.data);
      });

    setInterval(() => {
      const id = window.location.pathname.split("").pop()
        ? window.location.pathname.split("/").pop()?.trim()
        : "";

      if (id != queue._id) {
        queue._id = id;
        setQueue(queue);
        setRequests(["loading"]);

        setRulesRead(false);
        fetch(`/api/queues/${id}`)
          .then((r) => r.json())
          .then((q) => {
            if (q.status != 200) return;

            setQueue(q.data);
          });

        fetch(
          `/api/queues/${id}/requests?type=${filters.type}&status=${filters.status}`
        )
          .then((r) => r.json())
          .then((q) => {
            if (q.status != 200) return;

            q.data.sort(
              (a: IRequest, b: IRequest) =>
                new Date(b.date).valueOf() - new Date(a.date).valueOf()
            );

            setRequests(q.data);
          });

        fetch(`/api/queues/${queue_id}/follow`, {
          headers:
            login._id != -1
              ? {
                  authorization: login.account_token,
                }
              : null,
        })
          .then((r) => r.json())
          .then((res) => {
            setFollowers(res.data);
          });

        SyncQueueData(login);
      }
    }, 10);

    SyncQueueData(login);
  }, []);

  useEffect(() => {
    if (requestToFocus) {
      fetch(`/api/requests/${requestToFocus}?includeBeatmap=true`)
        .then((r) => r.json())
        .then((d) => {
          if (d.status != 200) {
            location.search = "";
            return enqueueSnackbar(d.message, {
              variant: "error",
              persist: false,
            });
          }

          manageRequestPanel.setRequest(d.data);
          manageRequestPanel.setOpen(true);
        });
    }
  }, [requestToFocus]);

  useEffect(() => {
    const queue_id = window.location.pathname.split("").pop()
      ? window.location.pathname.split("/").pop()?.trim()
      : "";

    fetch(`/api/queues/${queue_id}/follow`, {
      headers:
        login._id != -1
          ? {
              authorization: login.account_token,
            }
          : null,
    })
      .then((r) => r.json())
      .then((res) => {
        setFollowers(res.data);
      });
  }, []);

  function setFilters(ev: React.SyntheticEvent<InputEvent>, filter: string) {
    const queue_id = window.location.pathname.split("").pop()
      ? window.location.pathname.split("/").pop()?.trim()
      : "";

    const target: any = ev.target;
    filters[filter] = target.value;

    updateFilters(filters);

    fetch(
      `/api/queues/${queue_id}/requests?type=${filters.type}&status=${filters.status}`
    )
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        q.data.sort(
          (a: IRequest, b: IRequest) =>
            new Date(a.date).valueOf() - new Date(b.date).valueOf()
        );

        setRequests(["loading"]);
        setRequests(q.data);
      });
  }

  useEffect(() => {
    document.title = `${queue.name} | osu!modhub`;
  }, [queue]);

  function loginWarn() {
    return enqueueSnackbar("Log-in to do this!", {
      variant: "error",
      persist: false,
    });
  }

  function refreshRequests() {
    const queue_id = window.location.pathname.split("").pop()
      ? window.location.pathname.split("/").pop()?.trim()
      : "";

    fetch(
      `/api/queues/${queue_id}/requests?type=${filters.type}&status=${filters.status}`
    )
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        q.data.sort(
          (a: IRequest, b: IRequest) =>
            new Date(a.date).valueOf() - new Date(b.date).valueOf()
        );

        setRequests(["loading"]);
        setRequests(q.data);
      });
  }

  const refreshRequestStatus = (request: IRequest) => {
    const i = requests.findIndex((r) => r._id == request._id);

    request.isWs = true;
    requests[i] = request;

    console.log(requests);

    setRequests(JSON.parse(JSON.stringify(requests)));
  };

  const addNewRequest = (request: IRequest) => {
    request.isWs = true;
    requests.unshift(request);

    console.log(requests);

    setRequests(JSON.parse(JSON.stringify(requests)));
  };

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  function goToUserQueue() {
    goTo(`/queue/${login._id}`);
  }

  function updateFollow() {
    if (queue._id == login._id) return;

    if (followers.mutual) {
      fetch(`/api/queues/${queue._id}/follow`, {
        method: "delete",
        headers: {
          authorization: login.account_token,
        },
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.status == 200) {
            followers.size = followers.size - 1;
            setFollowers(followers);
            updateFollowButtonIcon(false);
          }

          return enqueueSnackbar(res.message, {
            variant: res.status == 200 ? "success" : "error",
            persist: false,
          });
        });
    } else {
      fetch(`/api/queues/${queue._id}/follow`, {
        method: "post",
        headers: {
          authorization: login.account_token,
        },
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.status == 200) {
            followers.size = followers.size + 1;
            setFollowers(followers);
            updateFollowButtonIcon(false);
          }

          return enqueueSnackbar(res.message, {
            variant: res.status == 200 ? "success" : "error",
            persist: false,
          });
        });
    }
  }

  function updateFollowButtonIcon(hover: boolean) {
    if (hover == true)
      return setFollowButtonIcon(
        !followers.mutual ? faUserPlus : faUserLargeSlash
      );

    return setFollowButtonIcon(faUser);
  }

  useEffect(() => {
    ws.onopen = () => {
      console.log("[Queues] -> Connected!");
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);

      console.log(lastManagedRequest);

      if (
        lastManagedRequest.includes(data.data._id) ||
        data.data._queue != queue._id
      )
        return;

      if (data.type == "request:update") refreshRequestStatus(data.data);

      if (data.type == "request:new") addNewRequest(data.data);
    };
  }, [requests]);

  const loadingRequests = (
    <div className="loadingcontainer">
      <div className="patchouli"></div>
      <p>Loading requests...</p>
    </div>
  );

  return (
    <>
      <SelectedRequestContextProvider>
        <AppBar></AppBar>
        <div className="queue">
          <PageBanner src={queue.banner} css={{}}>
            <div className="mobile-meta">
              <div
                className="icon round1"
                style={{
                  backgroundImage: `url(https://a.ppy.sh/${queue._id})`,
                  border: `5px solid var(--${queue.open ? "green" : "red"})`,
                }}
              ></div>
              <div className="meta">
                <p
                  className="queuename"
                  onClick={() => {
                    window.open(`https://osu.ppy.sh/u/${queue._id}`);
                  }}
                >
                  {queue.name}
                  {queue.verified ? (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="verifiedbadge"
                      color="#25ca6a"
                      style={{
                        width: "18px",
                        marginLeft: "5px",
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </p>
                <div className="row center">
                  <Tag
                    content={queue.type}
                    style={{
                      backgroundColor: typeColors[queue.type],
                      color: "white",
                      marginTop: "5px",
                    }}
                  />
                  {queue.modes.map((m) => {
                    return (
                      <div className="modeicon" key={GenerateComponentKey(20)}>
                        {icons[m]}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </PageBanner>
        </div>
        <ConfirmDialog></ConfirmDialog>
        <RequestPanel
          queue={queue}
          setRequests={setRequests}
          requests={requests}
        ></RequestPanel>
        <QueuePanel></QueuePanel>
        <MyRequestsPanel></MyRequestsPanel>
        <ManageRequestPanel
          queue={queue}
          requests={requests}
          setRequests={setRequests}
        ></ManageRequestPanel>
        <NotificationSideMenu></NotificationSideMenu>
        <SideMenu
          _open={sideMenuContext.open}
          options={[
            { label: "My queue", callback: goToUserQueue },
            {
              label: login.hasQueue ? "Queue settings" : "Create a queue",
              callback: () => {
                login.hasQueue
                  ? queuePanelContext.setOpen(true)
                  : CreateNewQueue(login);
              },
            },
            {
              label: "My Requests",
              callback: () => {
                requestsPanelContext.setOpen(true);
              },
            },
            {
              label: "Log-out",
              callback: () => {
                DestroySession();
              },
            },
          ]}
          title={`Hello, ${login.username}!`}
        ></SideMenu>
        <div className="queuelayout">
          <div className="headerleft" key={GenerateComponentKey(100)}>
            <div className="meta">
              <div
                className="icon round1"
                style={{
                  backgroundImage: `url(https://a.ppy.sh/${queue._id})`,
                  border: `5px solid var(--${queue.open ? "green" : "red"})`,
                }}
              ></div>
              <Tag
                content={queue.type}
                style={{
                  backgroundColor: typeColors[queue.type],
                  color: "white",
                  marginTop: "5px",
                }}
              />
              <div className="row center">
                {queue.modes.map((m) => {
                  return (
                    <div className="modeicon" key={GenerateComponentKey(20)}>
                      {icons[m]}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="info">
              <div className="row requestandname">
                <p
                  className="queuename"
                  onClick={() => {
                    window.open(`https://osu.ppy.sh/u/${queue._id}`);
                  }}
                >
                  {queue.name}
                  {queue.verified ? (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="verifiedbadge"
                      color="#25ca6a"
                      style={{
                        width: "18px",
                        marginLeft: "5px",
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </p>
                <div className="row buttonsrow">
                  <button
                    className="custombuttom"
                    style={{
                      backgroundColor: `var(--${
                        login._id == -1 ? "red" : queue.open ? "green" : "red"
                      })`,
                      color: `${
                        login._id == -1
                          ? "white"
                          : queue.open
                          ? "black"
                          : "white"
                      }`,
                    }}
                    onClick={() => {
                      if (login._id == -1) return loginWarn();
                      if (!queue.open && login._id != queue._id) return;

                      setOpen(true);
                    }}
                  >
                    Request
                  </button>
                  <button
                    key={GenerateComponentKey(20)}
                    className={
                      followers.mutual
                        ? "custombutton following-button"
                        : "custombuttom"
                    }
                    onClick={() => {
                      if (login._id == -1) return loginWarn();
                      updateFollow();
                    }}
                    onMouseOver={() => {
                      updateFollowButtonIcon(true);
                    }}
                    onMouseLeave={() => {
                      updateFollowButtonIcon(false);
                    }}
                  >
                    {followers.size}
                    <FontAwesomeIcon icon={followButtonIcon} />
                  </button>
                </div>
              </div>
              <div className="queuerules-big customscroll">
                <Markdown
                  options={{
                    disableParsingRawHTML: true,
                  }}
                >
                  {queue.description}
                </Markdown>
              </div>
              {/* <div className="queue-preferences">
                <div className="wrapper">
                  {queue.genres.map((g, i) => {
                    return <div className="genre">{g}</div>;
                  })}
                </div>
              </div> */}
            </div>
          </div>
          <nav className="queuenav">
            <SearchSelect
              label="Status"
              options={
                <>
                  <option value="any">Any</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="nominated">Nominated</option>
                  <option value="finished">Finished</option>
                  <option value="waiting">Waiting Another BN</option>
                  <option value="rechecking">Need Recheck</option>
                </>
              }
              onSelect={(ev: React.SyntheticEvent<InputEvent>) => {
                setFilters(ev, "status");
              }}
            ></SearchSelect>
            <SearchSelect
              label="Type"
              options={
                <>
                  <option value="progress">In Progress</option>
                  <option value="archived">Archived</option>
                </>
              }
              onSelect={(ev: React.SyntheticEvent<InputEvent>) => {
                setFilters(ev, "type");
              }}
            ></SearchSelect>
          </nav>
          <div className="queuecontent">
            <div className="requestlisting">
              {requests[0] == "refresh" || requests.length == 0 ? (
                <NoRequests></NoRequests>
              ) : requests[0] == "loading" ? (
                loadingRequests
              ) : (
                requests.map((r: IRequest, i: number) => {
                  return (
                    <RequestSelector
                      request={r}
                      refreshRequests={refreshRequests}
                      requests={requests}
                      setRequests={setRequests}
                      queue={queue}
                      key={GenerateComponentKey(10)}
                    ></RequestSelector>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <footer
          style={{
            marginTop: "50px",
          }}
        >
          Made with <span>❤</span> by{" "}
          <a href="https://osu.ppy.sh/users/15821708">Sebola</a>
        </footer>
        <AudioPlayer requests={requests}></AudioPlayer>
      </SelectedRequestContextProvider>
    </>
  );
};
