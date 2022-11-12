import { faListSquares, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import "./../../styles/MyRequestsPanel.scss";
import { useSnackbar } from "notistack";
import { MyRequestPanelContext } from "../../providers/MyRequestsPanelContext";
import RequestViewer from "./RequestViewer";
import SearchSelect from "./SearchSelect";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import RequestSelector from "./RequestSelector";
import NoRequests from "./NoRequests";
import LoadingComponent from "./LoadingComponent";
import { getLocalization } from "../../localization/localizationManager";

export default () => {
  const { login, setLogin } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const { open, setOpen } = useContext(MyRequestPanelContext);
  const [requests, setRequests] = useState<any[]>(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [filters, updateFilters] = useState<{ [key: string]: any }>({
    type: "progress",
    status: "any",
  });

  function setFilters(ev: React.SyntheticEvent<InputEvent>, filter: string) {
    setLoading(true);
    const target: any = ev.target;
    filters[filter] = target.value;

    updateFilters(filters);

    fetch(
      `/api/users/${login._id}/requests?type=${filters.type}&status=${filters.status}`
    )
      .then((r) => r.json())
      .then((q) => {
        if (q.status != 200) return;

        setRequests([]);
        setRequests(q.data);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (login._id == "-1" && !open) return;

    setLoading(true);
    document.addEventListener("keydown", (ev) => {
      if (!ev.target) return;
      if (ev.key != "Escape") return;

      setOpen(false);

      return;
    });

    fetch(
      `/api/users/${login._id}/requests?type=${filters.type}&status=${filters.status}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.status != 200)
          return enqueueSnackbar(d.message, {
            variant: "error",
          });

        setRequests([]);
        setRequests(d.data);
        setLoading(false);
      });
  }, [open]);

  function auxClosePanel(ev: any) {
    if (ev.target.className != "myrequestspanel open") return;

    setOpen(!open);

    return;
  }

  function escClosePanel(ev: any) {
    if (ev.target.className != "myrequestspanel open") return;
    if (ev.key != "escape") return;

    setOpen(!open);

    return;
  }

  function listMaps() {
    if (requests == null)
      return <LoadingComponent text="Loading requests..." />;
    if (requests.length == 0) return <NoRequests />;

    return requests.map((r) => {
      return (
        <RequestSelector
          request={r}
          queue={null}
          _static={true}
          key={GenerateComponentKey(20)}
        ></RequestSelector>
      );
    });
  }

  return (
    <div
      className={open ? "myrequestspanel open" : "myrequestspanel closed"}
      onClick={(ev) => {
        auxClosePanel(ev);
      }}
      onKeyDown={escClosePanel}
    >
      <div className="container">
        <div className="paneltitle">
          <FontAwesomeIcon
            icon={faListSquares}
            color="#fff"
            onClick={() => {
              setOpen(false);
            }}
            style={{
              display: "block",
              marginLeft: "auto",
            }}
          />
          My Requests
          <FontAwesomeIcon
            icon={faTimes}
            color="#fff"
            onClick={() => {
              setOpen(false);
            }}
            className="close"
            style={{
              display: "block",
              marginLeft: "auto",
            }}
          />
        </div>
        <div className="filters">
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
        </div>
        <div
          className={
            loading ? "requests loading customscroll" : "requests customscroll"
          }
        >
          {listMaps()}
        </div>
      </div>
    </div>
  );
};
