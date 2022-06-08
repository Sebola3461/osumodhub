import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { RequestContext } from "../../providers/RequestContext";
import { RequestPanelContext } from "../../providers/RequestPanelContext";
import { Beatmapset } from "../../types/beatmap";
import BeatmapSelector from "../global/BeatmapSelector";
import "./../../styles/RequestPanel.css";
import BeatmapsTab from "./RequestPanel/BeatmapsTab";
import RequestTab from "./RequestPanel/RequestTab";

export default ({
  queue,
  requests,
  setRequests,
}: {
  queue: any;
  setRequests: any;
  requests: any[];
}) => {
  const [userBeatmaps, setUserBeatmaps] = useState<Beatmapset[]>([]);
  const [tab, setTab] = useState(0);
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const { request, setRequest } = useContext(RequestContext);
  const { open, setOpen } = useContext(RequestPanelContext);

  useEffect(() => {
    if (login._id == -1) return;

    fetch(`/api/users/${login._id}/beatmaps`, {
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status != 200) return alert(d.message);

        setUserBeatmaps(d.data);
      });

    document.addEventListener("keydown", (ev) => {
      if (!ev.target) return;
      if (ev.key != "Escape") return;

      setOpen(false);

      return;
    });
  }, []);

  useEffect(() => {
    if (request.beatmap.id == -1 || !request.beatmap.id) setTab(0);
  }, [tab]);

  const tabs = [
    <BeatmapsTab userBeatmaps={userBeatmaps}></BeatmapsTab>,
    <RequestTab
      queue={queue}
      requests={requests}
      setRequests={setRequests}
    ></RequestTab>,
  ];

  function auxClosePanel(ev: any) {
    if (ev.target.className != "requestpanel open") return;

    setOpen(!open);

    return;
  }

  function escClosePanel(ev: any) {
    if (ev.target.className != "requestpanel open") return;
    if (ev.key != "escape") return;

    setOpen(!open);

    return;
  }

  return (
    <div
      className={open ? "requestpanel open" : "requestpanel closed"}
      onClick={(ev) => {
        auxClosePanel(ev);
      }}
      onKeyDown={escClosePanel}
    >
      <div className="container">
        <div className="paneltitle">
          Request beatmap
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
        <div className="tab">
          <div
            className={tab == 0 ? "option selected" : "option"}
            onClick={() => {
              setTab(0);
            }}
          >
            Beatmaps
          </div>
          <div
            className={tab == 1 ? "option selected" : "option"}
            onClick={() => {
              setTab(1);
            }}
          >
            Request
          </div>
        </div>
        {tabs[request.beatmap.id == -1 || !request.beatmap.id ? 0 : tab]}
      </div>
    </div>
  );
};
