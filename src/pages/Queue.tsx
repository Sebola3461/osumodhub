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
  const { open, setOpen } = useContext(RequestPanelContext);
  const sideMenuContext = useContext(SideMenuContext);
  const queuePanelContext = useContext(QueuePanelContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [followersCount, setFollowersCount] = useState(0);
  const [followButtonIcon, setFollowButtonIcon] = useState(faUser);

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

  const [requests, setRequests] = useState<any>(["refresh"]);
  const [followers, setFollowers] = useState<any>(["loading"]);

  useEffect(() => {
    const queue_id = window.location.pathname.split("").pop()
      ? window.location.pathname.split("/").pop()?.trim()
      : "";

    fetch(`/api/queues/${queue_id}`)
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        setQueue(q.data);
      });

    fetch(`/api/queues/${queue_id}/requests`)
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        q.data.sort(
          (a: IRequest, b: IRequest) =>
            new Date(b.date).valueOf() - new Date(a.date).valueOf()
        );

        setRequests(q.data);
      });

    SyncQueueData(login);
  }, []);

  useEffect(() => {
    const queue_id = window.location.pathname.split("").pop()
      ? window.location.pathname.split("/").pop()?.trim()
      : "";

    fetch(`/api/queues/${queue_id}/follow`)
      .then((r) => r.json())
      .then((res) => {
        setFollowers(res.data);
        setFollowersCount(res.data.length);
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

        setRequests([]);
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

        setRequests([]);
        setRequests(q.data);
      });
  }

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  function goToUserQueue() {
    goTo(`/queue/${login._id}`);
  }

  function updateFollow() {
    if (followers[0] == "loading") return;

    if (followers.find((u: { _user: any }) => u._user == login._id)) {
      fetch(`/api/queues/${queue._id}/follow`, {
        method: "delete",
        headers: {
          authorization: login.account_token,
        },
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.status == 200) {
            followers.splice(
              followers.findIndex((f: { _user: any }) => f._user == login._id),
              1
            );

            setFollowers(followers);
            setFollowersCount(followersCount - 1);
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
            followers.push({ _user: login._id });
            setFollowers(followers);
            setFollowersCount(followersCount + 1);
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
        followers.findIndex((f: { _user: any }) => f._user == login._id) == -1
          ? faUserPlus
          : faUserLargeSlash
      );

    return setFollowButtonIcon(faUser);
  }

  return (
    <>
      <AppBar></AppBar>
      <PageBanner src={queue.banner} css={{}}></PageBanner>
      <RequestPanel
        queue={queue}
        setRequests={setRequests}
        requests={requests}
      ></RequestPanel>
      <QueuePanel></QueuePanel>
      <MyRequestsPanel></MyRequestsPanel>
      <ManageRequestPanel></ManageRequestPanel>
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
        <HeaderPanel
          style={{
            width: "250px",
            height: "70vh",
            marginLeft: "1rem",
            display: "inline-flex",
            alignItems: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
            alignContent: "center",
            justifyContent: "flex-start",
            position: "sticky",
            top: "141px",
          }}
        >
          <div className="headerleft">
            <div
              className="icon round1"
              style={{
                backgroundImage: `url(https://a.ppy.sh/${queue._id})`,
                border: `5px solid var(--${queue.open ? "green" : "red"})`,
              }}
            ></div>
            <p className="queuename">
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
            <div className="row buttonsrow">
              <button
                className="custombuttom"
                style={{
                  backgroundColor: `var(--${
                    login._id == -1 ? "red" : queue.open ? "green" : "red"
                  })`,
                  color: `${
                    login._id == -1 ? "white" : queue.open ? "black" : "white"
                  }`,
                }}
                onClick={() => {
                  if (login._id == -1) return loginWarn();
                  setOpen(queue.open);
                }}
              >
                Request
              </button>
              <button
                className={
                  followers.find((f: { _user: any }) => f._user == login._id)
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
                {followers.length}
                <FontAwesomeIcon icon={followButtonIcon} />
              </button>
            </div>
          </div>
        </HeaderPanel>
        <div className="queuecontent">
          <nav className="queuenav">
            <SearchSelect
              label="Sort"
              options={
                <>
                  <option>Date</option>
                  <option>Title</option>
                  <option>Artist</option>
                </>
              }
              onSelect={console.log}
            ></SearchSelect>
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
          <div className="requestlisting">
            {requests.length == 0 || requests[0] == "refresh" ? (
              <NoRequests></NoRequests>
            ) : (
              requests.map((r: IRequest, i: React.Key | null | undefined) => {
                return (
                  <RequestSelector
                    request={r}
                    refreshRequests={refreshRequests}
                    queue={queue}
                    key={r._id}
                  ></RequestSelector>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};
