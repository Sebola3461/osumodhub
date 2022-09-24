import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import "./../../styles/MyRequestsPanel.css";
import { useSnackbar } from "notistack";
import { MyRequestPanelContext } from "../../providers/MyRequestsPanelContext";
import RequestViewer from "./RequestViewer";
import SearchSelect from "./SearchSelect";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";

export default () => {
  const { login, setLogin } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const { open, setOpen } = useContext(MyRequestPanelContext);
  const [requests, setRequests] = useState<any[]>([]);
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

        q.data.sort(
          (a: any, b: any) =>
            new Date(a.date).valueOf() - new Date(b.date).valueOf()
        );

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

        d.data.sort(
          (a: any, b: any) =>
            new Date(a.date).valueOf() - new Date(b.date).valueOf()
        );

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
          My Requests
          <FontAwesomeIcon
            icon={faTimes}
            color="#fff"
            onClick={() => {
              setOpen(false);
            }}
            style={{
              display: "block",
              marginLeft: "auto",
            }}
          />
        </div>
        <div className="filters">
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
        </div>
        <div className={loading ? "requests loading" : "requests"}>
          {requests.length > 0 ? (
            requests.map((r) => {
              return (
                <RequestViewer
                  request={r}
                  key={GenerateComponentKey(20)}
                ></RequestViewer>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
