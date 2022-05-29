import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
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

function App() {
  const [queues, setQueues] = useState([]);
  const [filters, updateFilters] = useState<{ [key: string]: string }>({
    type: "any",
    open: "any",
    mode: "any",
    sort: "ab",
    query: "",
  });

  useEffect(() => {
    fetch("/api/queues/listing")
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        setQueues(q.data);
      });
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

    fetch(
      `/api/queues/listing?q=${filters.query}&open=${filters.open}&sort=${filters.sort}&mode=${filters.mode}`
    )
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        setQueues(q.data);
      });
  }

  return (
    <>
      <AppBar></AppBar>
      <PageBanner src="/src/static/images/homebanner.png"></PageBanner>
      {/* <SideMenu
        open={true}
        options={[{ label: "My queue", callback: console.log }]}
        title="User"
      ></SideMenu> */}
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
                <option value="bn">BN</option>
                <option value="nat">NAT</option>
                <option value="modder">Modder</option>
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
      <div className="queuelisting" id="queuelisting">
        {queues.map((q) => {
          return <QueueSelector queue={q}></QueueSelector>;
        })}
      </div>
    </>
  );
}

export default App;
