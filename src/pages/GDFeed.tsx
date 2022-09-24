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
import "./../styles/pages/GDFeed.css";
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
import GDSelector from "../components/gd/GDSelector";
import {
  PostGDPanelContext,
  PostGDPanelProvider,
} from "../providers/PostGDPanelContext";
import PostGDPanel from "../components/gd/PostGDPanel";
import GDPanel from "../components/gd/GDPanel";
import { GDPanelContext } from "../providers/GDPanelContext";
import ManageGDPanel from "../components/gd/ManageGDPanel";
import { ManageGDPanelContext } from "../providers/ManageGDPanelContext";

function GDFeed() {
  const [gds, setGds] = useState<any>({
    new: ["loading"],
    pop: ["loading"],
    anime: ["loading"],
    electronic: ["loading"],
    rock: ["loading"],
    "video game": ["loading"],
    novelty: ["loading"],
    jazz: ["loading"],
    "Hip hop": ["loading"],
    classical: ["loading"],
  });
  const { filters, updateFilters } = useContext<any>(HomeFilterContext);
  const [loading, setLoading] = useState(false);
  const sideMenuContext = useContext(UserSideMenuContext);
  const { login, setLogin } = useContext(AuthContext);

  const queuePanelContext = useContext(QueuePanelContext);
  const requestsPanelContext = useContext(MyRequestPanelContext);
  const postPanel = useContext(PostGDPanelContext);
  const gdPanel = useContext(GDPanelContext);
  const manageGdPanel = useContext(ManageGDPanelContext);

  useEffect(() => {
    setLoading(true);

    const categories = Object.keys(gds);

    for (const category of categories) {
      fetch(`/api/gd/listing?category=${category}`)
        .then((r) => r.json())
        .then((q) => {
          if (q.status != 200) return;

          gds[category] = q.data;
          setGds(JSON.parse(JSON.stringify(gds)));
          setLoading(false);
        });
    }

    SyncQueueData(login);
    document.title = `Guest Difficulties | osu!modhub`;

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
      `/api/queues/?q=${filters.query}&open=${filters.open}&sort=${filters.sort}&mode=${filters.mode}&type=${filters.type}`
    )
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        setGds(q.data);
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
      `/api/queues/?q=${filters.query}&open=${filters.open}&sort=${filters.sort}&mode=${filters.mode}&type=${filters.type}`
    )
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        setGds(q.data);
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

  function togglePostPanel() {
    postPanel.setOpen(!postPanel.open);
  }

  function toggleManageGDPanel() {
    manageGdPanel.setOpen(!manageGdPanel.open);
  }

  if (new URLSearchParams(window.location.search).has("b")) {
    gdPanel.setOpen(true);
  }

  function getListing() {
    const listing = [
      <div className="category">
        <p className="categoryname">New Posts</p>
        <div className="listing">
          {gds.new[0] != "loading" ? (
            gds.new.map((r) => {
              return (
                <GDSelector
                  request={r}
                  onClick={() => {
                    gdPanel.setGD(r);
                    gdPanel.setOpen(true);
                  }}
                />
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>,
    ];

    Object.keys(gds)
      .filter((k) => k != "new")
      .forEach((category) => {
        function getContent() {
          if (gds[category][0] == "loading") return <></>;
          if (gds[category].length == 0) return <NoRequests></NoRequests>;

          return gds[category].map((r) => {
            return (
              <GDSelector
                request={r}
                onClick={() => {
                  gdPanel.setGD(r);
                  gdPanel.setOpen(true);
                }}
              />
            );
          });
        }

        listing.push(
          <div className="category grid">
            <p className="categoryname">
              {category[0].toUpperCase().concat(category.slice(1))}
            </p>
            <div className="listing">{getContent()}</div>
          </div>
        );
      });

    return listing;
  }

  return (
    <>
      <AppBar></AppBar>
      <PageBanner src="/static/images/homebanner.png"></PageBanner>
      <QueuePanel></QueuePanel>
      <MyRequestsPanel></MyRequestsPanel>
      {/* <SideMenu
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
      ></SideMenu> */}
      <NotificationSideMenu></NotificationSideMenu>
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
      <div className="actionsrow">
        <button onClick={togglePostPanel} className="requestbutton">
          Request
        </button>
        <button onClick={toggleManageGDPanel} className="requestbutton">
          My Posts
        </button>
      </div>
      <GDPanel></GDPanel>
      <PostGDPanel></PostGDPanel>
      <ManageGDPanel></ManageGDPanel>
      {getListing()}
      <div className="queuelisting"></div>
      <footer>
        Made with <span>❤</span> by{" "}
        <a href="https://osu.ppy.sh/users/15821708">Sebola</a>
      </footer>
    </>
  );
}

export default GDFeed;
