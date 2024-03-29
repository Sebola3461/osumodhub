import React, { useContext, useEffect, useState } from "react";
import AppBar from "../components/global/AppBar";
import PageBanner from "../components/global/PageBanner";
import "./../styles/pages/Queue.css";
import Tag from "../components/global/Tag";
import CatchIcon from "../components/icons/CatchIcon";
import ManiaIcon from "../components/icons/ManiaIcon";
import OsuIcon from "../components/icons/OsuIcon";
import TaikoIcon from "../components/icons/TaikoIcon";
import SearchSelect from "../components/global/SearchSelect";
import NoRequests from "../components/global/NoRequests";
import { AuthContext } from "../providers/AuthContext";
import RequestPanel from "../components/queue/RequestPanel";
import { RequestPanelContext } from "../providers/RequestPanelContext";
import SideMenu from "../components/global/SideMenu";
import { useNavigate } from "react-router-dom";
import { UserSideMenuContext } from "../providers/UserSideMenu";
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
import { IQueue, IQueueRequest } from "../types/queue";
import LoadingPage from "./LoadingPage";
import QueueColors from "../constants/QueueColors";
import LoadingComponent from "../components/global/LoadingComponent";
import RequestSelector from "../components/global/RequestSelector";
import { QueueContext } from "../providers/QueueContext";
import UserPanel from "../components/global/UserPanel";
import { RequestWsContext } from "../providers/RequestWsQueueContext";
import QueueStatistics from "../components/queue/QueueStatistics";
import GDRequestPanel from "../components/queue/GDRequestPanel";
import QueueGroupsSideMenu from "../components/global/QueueGroupsSideMenu";
import CreateNewGroupPanel from "../components/global/CreateNewGroupPanel";
import GroupMembers from "../components/queue/GroupMembers";
import GDSelector from "../components/gd/GDSelector";
import AdComponent from "../components/global/AdComponent";
import { hexToRGB } from "../helpers/hexToRGB";
import { getLocalization } from "../localization/localizationManager";
import { CreateGDRequest } from "../components/CreateGDRequest";

interface IQueueFilters {
  type: "progress" | "archived";
  status: string;
}

export default () => {
  const icons = [
    <OsuIcon color="white" width="1.2rem" height="1.2rem"></OsuIcon>,
    <TaikoIcon color="white" width="1.2rem" height="1.2rem"></TaikoIcon>,
    <CatchIcon color="white" width="1.2rem" height="1.2rem"></CatchIcon>,
    <ManiaIcon color="white" width="1.2rem" height="1.2rem"></ManiaIcon>,
  ];

  const [filters, updateFilters] = useState<IQueueFilters>({
    type: "progress",
    status: "any",
  });

  const { login } = useContext(AuthContext);
  const { setOpen } = useContext(RequestPanelContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [followButtonIcon, setFollowButtonIcon] = useState(faUser);
  const requestWsContext = useContext(RequestWsContext);
  const [ws, setWs] = useState(
    new WebSocket(
      window.location.hostname == "localhost"
        ? "ws://localhost:3001/"
        : "wss://osumodhub.xyz/ws"
    )
  );

  ws.onmessage = (ev) => {
    requestWsContext.processData(JSON.parse(ev.data));
  };

  const queue = useContext(QueueContext);

  const QueueID = location.pathname.split("/").pop().trim();

  useEffect(() => {
    console.log("Refreshing queue data");

    fetch(`/api/queues/${QueueID}`)
      .then((r) => r.json())
      .then((data) => {
        queue.setData(data.data);
        document.title = `${data.data.name} | osu!modhub`;
      });

    refreshRequests();
    refreshFollowers();

    SyncQueueData(login);
  }, []);

  function refreshRequests() {
    console.log("Refreshing queue requests");

    fetch(
      `/api/queues/${QueueID}/requests?type=${filters.type}&status=${filters.status}`
    )
      .then((r) => r.json())
      .then((data) => {
        queue.setRequests(data.data);
      });
  }

  function refreshFollowers(change?: boolean) {
    console.log("Updating followers data");

    if (!queue.followers && change == undefined) {
      // ? We need to provide account token to check if the user is following the queue
      fetch(`/api/queues/${QueueID}/follow`, {
        headers: {
          authorization: login.account_token,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          queue.setFollowers(data.data.size);
          queue.setFollowing(data.data.mutual);
        });
    }

    if (queue.following && change == true) {
      queue.setFollowing(false);

      // ? We need to provide account token to check if the user is following the queue
      fetch(`/api/queues/${QueueID}/follow`, {
        method: "delete",
        headers: {
          authorization: login.account_token,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.status != 200) {
            enqueueSnackbar(data.message);
            return queue.setFollowing(queue.following);
          }
          queue.setFollowers(queue.followers - 1);

          enqueueSnackbar(data.message);
        });
    }

    if (!queue.following && change == true) {
      queue.setFollowing(true);

      // ? We need to provide account token to check if the user is following the queue
      fetch(`/api/queues/${QueueID}/follow`, {
        method: "post",
        headers: {
          authorization: login.account_token,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.status != 200) {
            enqueueSnackbar(data.message);
            return queue.setFollowing(queue.following);
          }
          queue.setFollowers(queue.followers + 1);

          enqueueSnackbar(data.message);
        });
    }
  }

  function setFilters(event: React.SyntheticEvent<InputEvent>, filter: any) {
    const target: any = event.target;
    const value = target.value;

    filters[filter] = value;

    updateFilters(filters);
    refreshRequests();
  }

  function getRequestsListing() {
    if (!queue.requests) return <LoadingComponent text="Loading requests..." />;

    if (queue.requests.length < 1) return <NoRequests />;

    // ? Sort requests by date
    queue.requests.sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
    );

    const Ad = () => (
      <>
        {/* <AdComponent
          googleAdId="ca-pub-4942085522020898"
          slot="1067536755"
          classNames="adsbygoogle queue"
          timeout={1000}
          format="fluid"
          layout={"in-article"}
        /> */}
      </>
    );

    const allowAdsOn = [0, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105];
    return queue.requests.map((request, index) => {
      if (allowAdsOn.includes(index))
        return (
          <>
            <Ad />
            <RequestSelector
              queue={queue.data}
              request={request}
              refreshRequests={refreshRequests}
              setRequests={queue.setData}
              key={GenerateComponentKey(10)}
            />
          </>
        );
      return (
        <RequestSelector
          queue={queue.data}
          request={request}
          refreshRequests={refreshRequests}
          setRequests={queue.setData}
          key={GenerateComponentKey(10)}
        />
      );
    });
  }

  if (!queue.data) return <LoadingPage text="Loading queue..." />;

  function getDarkColor(color: number[]) {
    const c: number[] = [];

    color.forEach((cl) => {
      c.push(cl - 20);
    });

    return c;
  }

  function getLightWhite(color: number[]) {
    const c: number[] = [];

    color.forEach((cl) => {
      c.push(cl + 200);
    });

    return c;
  }

  console.log(queue.data);

  return (
    <>
      <style
        key={GenerateComponentKey(20)}
      >{`:root { --accent: ${queue.data.color}; }`}</style>
      <style key={GenerateComponentKey(20)}>
        {`:root {
        --base: ${hexToRGB(queue.data.color).join(",")};
        --rgb: ${hexToRGB(queue.data.color).join(",")};
        --base-dark: ${getDarkColor(hexToRGB(queue.data.color)).join(",")};
        --rgb-dark: ${getDarkColor(hexToRGB(queue.data.color)).join(",")};
        --base-light: ${getLightWhite(hexToRGB(queue.data.color)).join(",")};
        --rgb-darklight: ${getLightWhite(hexToRGB(queue.data.color)).join(",")};
      }`}
      </style>
      {/* <CreateGDRequest /> */}
      <SelectedRequestContextProvider>
        <AppBar></AppBar>
        <div className="queue">
          <PageBanner src={queue.data.banner} css={{}}>
            <div className="mobile-meta">
              <div
                className="icon round1"
                style={{
                  backgroundImage: `url(${queue.data.icon})`,
                  border: `5px solid var(--${
                    queue.data.open ? "green" : "red"
                  })`,
                }}
              ></div>
              <div className="meta">
                <p
                  className="queuename"
                  onClick={() => {
                    queue.data.isGroup
                      ? void {}
                      : window.open(`https://osu.ppy.sh/u/${queue.data._id}`);
                  }}
                >
                  {queue.data.name}
                  {queue.data.verified ? (
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
                    content={queue.data.type}
                    style={{
                      backgroundColor: QueueColors[queue.data.type],
                      color: "white",
                      marginTop: "5px",
                    }}
                  />
                  {queue.data.modes.map((m) => {
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
        <RequestPanel />
        <QueuePanel />
        <MyRequestsPanel />
        <ManageRequestPanel />
        <NotificationSideMenu />
        <GDRequestPanel />
        <UserPanel />
        <QueueGroupsSideMenu />
        <CreateNewGroupPanel />
        <div className="queuelayout">
          <div className="headerleft" key={GenerateComponentKey(100)}>
            <div className="meta">
              <div
                className="icon round1"
                style={{
                  backgroundImage: `url(${queue.data.icon})`,
                  border: `5px solid var(--${
                    queue.data.open ? "green" : "red"
                  })`,
                }}
              ></div>
              <Tag
                content={queue.data.type}
                style={{
                  backgroundColor: QueueColors[queue.data.type],
                  color: "white",
                  marginTop: "5px",
                }}
              />
              <div className="row center">
                {queue.data.modes.map((m) => {
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
                    queue.data.isGroup
                      ? void {}
                      : window.open(`https://osu.ppy.sh/u/${queue.data._id}`);
                  }}
                >
                  {queue.data.name}
                  {queue.data.verified ? (
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
                        login._id == "-1"
                          ? "red"
                          : queue.data.open
                          ? "green"
                          : "red"
                      })`,
                      color: `${
                        login._id == "-1"
                          ? "white"
                          : queue.data.open
                          ? "black"
                          : "white"
                      }`,
                    }}
                    onClick={() => {
                      if (login._id == "-1") return;
                      if (
                        !queue.data.open &&
                        (queue.data.admins.includes(login._id) ||
                          queue.data.owner == login._id)
                      )
                        return setOpen(true);

                      if (!queue.data.open && login._id != queue.data.owner)
                        return;

                      setOpen(true);
                    }}
                  >
                    {getLocalization(login.language, [
                      "queues",
                      "requestButton",
                    ])}
                  </button>
                  <button
                    key={GenerateComponentKey(20)}
                    className={
                      queue.following
                        ? "custombutton following-button"
                        : "custombuttom"
                    }
                    onClick={() => {
                      if (login._id == "-1") return;
                      refreshFollowers(true);
                    }}
                  >
                    {queue.followers}
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
                  {queue.data.description}
                </Markdown>
              </div>
              {/* <div className="queue-preferences">
                <div className="wrapper">
                  {queue.data.genres.map((g, i) => {
                    return <div className="genre">{g}</div>;
                  })}
                </div>
              </div> */}
            </div>
          </div>
          <nav className="queuenav">
            <SearchSelect
              label={getLocalization(login.language, [
                "queues",
                "filters",
                "status",
                "label",
              ])}
              options={
                <>
                  <option value="any">
                    {getLocalization(login.language, [
                      "requests",
                      "status",
                      "any",
                    ])}
                  </option>
                  <option value="pending">
                    {getLocalization(login.language, [
                      "requests",
                      "status",
                      "pending",
                    ])}
                  </option>
                  <option value="accepted">
                    {getLocalization(login.language, [
                      "requests",
                      "status",
                      "accepted",
                    ])}
                  </option>
                  <option value="rejected">
                    {getLocalization(login.language, [
                      "requests",
                      "status",
                      "rejected",
                    ])}
                  </option>
                  <option value="nominated">
                    {getLocalization(login.language, [
                      "requests",
                      "status",
                      "nominated",
                    ])}
                  </option>
                  <option value="finished">
                    {getLocalization(login.language, [
                      "requests",
                      "status",
                      "finished",
                    ])}
                  </option>
                  <option value="waiting">
                    {getLocalization(login.language, [
                      "requests",
                      "status",
                      "waiting",
                    ])}
                  </option>
                  <option value="rechecking">
                    {getLocalization(login.language, [
                      "requests",
                      "status",
                      "rechecking",
                    ])}
                  </option>
                </>
              }
              onSelect={(ev: React.SyntheticEvent<InputEvent>) => {
                setFilters(ev, "status");
              }}
            ></SearchSelect>
            <SearchSelect
              label={getLocalization(login.language, [
                "queues",
                "filters",
                "type",
                "label",
              ])}
              options={
                <>
                  <option value="progress">
                    {getLocalization(login.language, [
                      "queues",
                      "filters",
                      "type",
                      "options",
                      "inProgress",
                    ])}
                  </option>
                  <option value="archived">
                    {getLocalization(login.language, [
                      "queues",
                      "filters",
                      "type",
                      "options",
                      "archived",
                    ])}
                  </option>
                </>
              }
              onSelect={(ev: React.SyntheticEvent<InputEvent>) => {
                setFilters(ev, "type");
              }}
            ></SearchSelect>
          </nav>
          {/* <QueueStatistics /> */}
          {queue.data.isGroup ? <GroupMembers /> : <></>}
          <div className="queuecontent">
            <div className="requestlisting">{getRequestsListing()}</div>
          </div>
        </div>
        <footer
          style={{
            marginTop: "50px",
          }}
        >
          <Markdown>
            {getLocalization(login.language, ["footer", "text"]).replace(
              "Sebola",
              `<a href="https://osu.ppy.sh/users/15821708">Sebola</a>`
            )}
          </Markdown>
        </footer>
      </SelectedRequestContextProvider>
    </>
  );
};
