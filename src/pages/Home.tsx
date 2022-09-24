import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import AppBar from "../components/global/AppBar";
import BigSearch from "../components/global/BigSearch";
import HeaderPanel from "../components/global/HeaderPanel";
import PageBanner from "../components/global/PageBanner";
import {
  faFilter,
  faGamepad,
  faListCheck,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./../styles/pages/Home.css";
import SearchSelect from "../components/global/SearchSelect";
import QueueSelector from "../components/global/QueueSelector";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/global/SideMenu";
import { UserSideMenuContext } from "../providers/UserSideMenu";
import { AuthContext } from "../providers/AuthContext";
import QueuePanel from "../components/queue/QueuePanel";
import { QueuePanelContext } from "../providers/QueuePanelContext";
import DestroySession from "../helpers/DestroySession";
import SyncQueueData from "../helpers/SyncQueueData";
import CreateNewQueue from "../helpers/CreateNewQueue";
import MyRequestsPanel from "../components/global/MyRequestsPanel";
import { MyRequestPanelContext } from "../providers/MyRequestsPanelContext";
import NotificationSideMenu from "../components/global/NotificationSideMenu";
import NoRequests from "../components/global/NoRequests";
import { HomeFilterContext } from "../providers/HomeFiltersContext";
import ConfirmDialog from "../components/global/ConfirmDialog";
import UserPanel from "../components/global/UserPanel";
import QueueGroupsSideMenu from "../components/global/QueueGroupsSideMenu";
import CreateNewGroupPanel from "../components/global/CreateNewGroupPanel";

function App() {
  const [queues, setQueues] = useState<any>(["loading"]);
  const { filters, updateFilters } = useContext<any>(HomeFilterContext);
  const [loading, setLoading] = useState(false);
  const sideMenuContext = useContext(UserSideMenuContext);
  const { login, setLogin } = useContext(AuthContext);

  const queuePanelContext = useContext(QueuePanelContext);
  const requestsPanelContext = useContext(MyRequestPanelContext);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/listing/queues?${
        filters.query.trim() != "" ? `q=${filters.query.trim()}` : ""
      }&open=${filters.open}&sort=${filters.sort}&mode=${filters.mode}&type=${
        filters.type
      }`
    )
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        setQueues(q.data);
        setLoading(false);
      });

    SyncQueueData(login);
    document.title = `Queues | osu!modhub`;

    // ? Automatic search
    let lastSearch = filters.query;
    setInterval(() => {
      //if (!filters.query) return;

      if (filters.query.trim() != lastSearch.trim()) {
        lastSearch = filters.query;

        refreshSearch();
      }
    }, 1000);
  }, []);

  function refreshSearch() {
    setLoading(true);

    fetch(
      `/api/listing/queues?q=${filters.query}&open=${filters.open}&sort=${filters.sort}&mode=${filters.mode}&type=${filters.type}`
    )
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        setQueues(q.data);
        setLoading(false);
      });
  }

  function updateSearch(ev: KeyboardEvent) {
    const target: any = ev.target;
    filters["query"] = target.value;

    updateFilters(filters);
  }

  function setFilters(ev: any, filter: string) {
    const target: any = ev.target;
    filters[filter] = target.value;

    const _filters = Object.assign(filters, { [filter]: target.value });

    updateFilters(_filters);

    setLoading(true);

    fetch(
      `/api/listing/queues?q=${filters.query}&open=${filters.open}&sort=${filters.sort}&mode=${filters.mode}&type=${filters.type}`
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

  const loadingQueues = (
    <div className="loadingcontainer">
      <div className="patchouli"></div>
      <p>Loading queues...</p>
    </div>
  );

  return (
    <>
      <AppBar></AppBar>
      <PageBanner src="/static/images/homebanner.png"></PageBanner>
      <ConfirmDialog></ConfirmDialog>
      <QueuePanel></QueuePanel>
      <MyRequestsPanel></MyRequestsPanel>
      <UserPanel />
      <QueueGroupsSideMenu />
      <NotificationSideMenu></NotificationSideMenu>
      <CreateNewGroupPanel />
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
        <BigSearch onInput={updateSearch} _default={filters.query}></BigSearch>
        <div className="row selectrow">
          <SearchSelect
            label="Type"
            icon={<FontAwesomeIcon icon={faUser} />}
            _default={filters.type}
            options={
              <>
                <option value="any">Any</option>
                <option value="nominator">Nominators</option>
                <option value="modder">Modders</option>
                <option value="group">Groups</option>
              </>
            }
            onSelect={(ev: any) => {
              setFilters(ev, "type");
            }}
          ></SearchSelect>
          <SearchSelect
            label="Status"
            icon={<FontAwesomeIcon icon={faListCheck} />}
            _default={filters.open}
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
            icon={<FontAwesomeIcon icon={faGamepad} />}
            _default={filters.mode}
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
            icon={<FontAwesomeIcon icon={faFilter} />}
            _default={filters.sort}
            options={
              <>
                <option value="ab">Name (A-Z)</option>
                <option value="ba">Name (Z-A)</option>
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
        {queues[0] == "refresh" || queues.length == 0 ? (
          <NoRequests text="Not found"></NoRequests>
        ) : queues[0] == "loading" ? (
          loadingQueues
        ) : (
          queues.map((q, i) => {
            return <QueueSelector queue={q} key={i}></QueueSelector>;
          })
        )}
      </div>
      <footer>
        Made with <span>❤</span> by{" "}
        <a href="https://osu.ppy.sh/users/15821708">Sebola</a>
      </footer>
    </>
  );
}

export default App;
