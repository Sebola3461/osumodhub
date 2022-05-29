import React, { useEffect, useState } from "react";
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
    country: {
      acronym: "--",
      name: "--",
      flag: "",
    },
    genres: [],
  });

  const [requests, setRequests] = useState([]);

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
            new Date(b.date).valueOf() - new Date(a.date).valueOf()
        );

        setRequests(q.data);
      });
  }

  return (
    <>
      <AppBar></AppBar>
      <PageBanner src={queue.banner} css={{}}></PageBanner>
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
            <p className="queuename">{queue.name}</p>
            <Tag
              content={queue.type}
              style={{
                backgroundColor: "var(--ocean)",
                color: "white",
                marginTop: "5px",
              }}
            />
            <div className="row center">
              {queue.modes.map((m, i) => {
                return <div className="modeicon">{icons[m]}</div>;
              })}
            </div>
            <button
              className="custombuttom"
              style={{
                backgroundColor: `var(--${queue.open ? "green" : "red"})`,
              }}
            >
              Request
            </button>
            <button className="custombuttom">Follow</button>
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
            {requests.length < 1 ? (
              <NoRequests></NoRequests>
            ) : (
              requests.map((r) => {
                return <RequestSelector request={r}></RequestSelector>;
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};
