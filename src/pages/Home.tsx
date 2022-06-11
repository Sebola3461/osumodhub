import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import AppBar from "../components/global/AppBar";
import BigSearch from "../components/global/BigSearch";
import HeaderPanel from "../components/global/HeaderPanel";
import PageBanner from "../components/global/PageBanner";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./../styles/pages/Home.css";
import SearchSelect from "../components/global/SearchSelect";
import QueueSelector from "../components/global/QueueSelector";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/global/SideMenu";
import { SideMenuContext } from "../providers/UserSideMenu";
import { AuthContext } from "../providers/AuthContext";
import QueuePanel from "../components/queue/QueuePanel";
import { QueuePanelContext } from "../providers/QueuePanelContext";
import DestroySession from "../helpers/DestroySession";
import SyncQueueData from "../helpers/SyncQueueData";
import CreateNewQueue from "../helpers/CreateNewQueue";

function App() {
  const [queues, setQueues] = useState([]);
  const [filters, updateFilters] = useState<{ [key: string]: string }>({
    type: "any",
    open: "any",
    mode: "any",
    sort: "ab",
    query: "",
  });
  const [loading, setLoading] = useState(false);
  const sideMenuContext = useContext(SideMenuContext);
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const queuePanelContext = useContext(QueuePanelContext);

  useEffect(() => {
    setLoading(true);
    fetch("/api/queues/listing")
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        setQueues(q.data);
        setLoading(false);
      });

    SyncQueueData(login);
    document.title = `Queues | osu!modhub`;
  }, []);

  function updateSearch(ev: KeyboardEvent) {
    const target: any = ev.target;

    if (ev.key == "Enter" || target.value.trim().length < 2) {
      setFilters(ev, "query");
    }
  }

  function setFilters(ev: any, filter: string) {
    const target: any = ev.target;
    filters[filter] = target.value;

    updateFilters(filters);

    setLoading(true);

    fetch(
      `/api/queues/listing?q=${filters.query}&open=${filters.open}&sort=${filters.sort}&mode=${filters.mode}&type=${filters.type}`
    )
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        setQueues(q.data);
        setLoading(false);
      });
  }

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  function goToUserQueue() {
    goTo(`/queue/${login._id}`);
  }

  return (
    <>
      <AppBar></AppBar>
      <PageBanner src="/static/images/homebanner.png"></PageBanner>
      <QueuePanel></QueuePanel>
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
            label: "Log-out",
            callback: () => {
              DestroySession();
            },
          },
        ]}
        title="User"
      ></SideMenu>
      <HeaderPanel
        style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          alignContent: "center",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "200px",
        }}
      >
        <p className="panel-title">
          <FontAwesomeIcon
            icon={faSearch}
            color="#fff"
            style={{
              marginRight: "10px",
            }}
          />
          Search
        </p>
        <BigSearch onInput={updateSearch}></BigSearch>
        <div className="row selectrow">
          <SearchSelect
            label="Type"
            options={
              <>
                <option value="any">Any</option>
                <option value="nominator">Nominators</option>
                <option value="modder">Modders</option>
              </>
            }
            onSelect={(ev: any) => {
              setFilters(ev, "type");
            }}
          ></SearchSelect>
          <SearchSelect
            label="Status"
            options={
              <>
                <option value="any">Any</option>
                <option value="true">Open</option>
                <option value="false">Closed</option>
              </>
            }
            onSelect={(ev: any) => {
              setFilters(ev, "open");
            }}
          ></SearchSelect>
          <SearchSelect
            label="Mode"
            options={
              <>
                <option value="any">Any</option>
                <option value="0">osu!</option>
                <option value="1">osu!taiko</option>
                <option value="2">osu!catch</option>
                <option value="3">osu!mania</option>
              </>
            }
            onSelect={(ev: any) => {
              setFilters(ev, "mode");
            }}
          ></SearchSelect>
          <SearchSelect
            label="Sort by"
            options={
              <>
                <option value="ab">Name (A-b)</option>
                <option value="ba">Name (B-a)</option>
              </>
            }
            onSelect={(ev: any) => {
              setFilters(ev, "sort");
            }}
          ></SearchSelect>
        </div>
      </HeaderPanel>
      <div
        className="queuelisting"
        id="queuelisting"
        style={{
          filter: `${loading ? "brightness(0.5)" : "brightness(1)"}`,
        }}
      >
        {queues.map((q, i) => {
          return <QueueSelector queue={q} key={i}></QueueSelector>;
        })}
      </div>
    </>
  );
}

export default App;
