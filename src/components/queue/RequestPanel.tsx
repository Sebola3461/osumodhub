import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { getLocalization } from "../../localization/localizationManager";
import { AuthContext } from "../../providers/AuthContext";
import { QueueContext } from "../../providers/QueueContext";
import { RequestContext } from "../../providers/RequestContext";
import { RequestPanelContext } from "../../providers/RequestPanelContext";
import { Beatmapset } from "../../types/beatmap";
import BeatmapSelector from "../global/BeatmapSelector";
import "./../../styles/RequestPanel.css";
import BeatmapsTab from "./RequestPanel/BeatmapsTab";
import RequestTab from "./RequestPanel/RequestTab";
import RulesTab from "./RequestPanel/RulesTab";

export default () => {
  const [userBeatmaps, setUserBeatmaps] = useState<Beatmapset[]>([]);
  const [tab, setTab] = useState(0);
  const { login, setLogin } = useContext(AuthContext);

  const { request, setRequest } = useContext(RequestContext);
  const { open, setOpen, rulesRead, setRulesRead } =
    useContext(RequestPanelContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const queueContext = useContext(QueueContext);

  useEffect(() => {
    if (login._id == "-1") return;

    if (!queueContext.data) return;

    fetch(
      `/api/users/${login._id}/beatmaps?graveyard=${queueContext.data.allow.graveyard}&wip=${queueContext.data.allow.wip}`,
      {
        headers: {
          authorization: login.account_token,
        },
      }
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.status != 200) return alert(d.message);

        setUserBeatmaps(d.data);
      });

    setRulesRead(false);
  }, [queueContext.data]);

  useEffect(() => {
    setUserBeatmaps(userBeatmaps);
  }, [userBeatmaps]);

  const tabs = [
    <BeatmapsTab
      userBeatmaps={userBeatmaps}
      setUserBeatmaps={setUserBeatmaps}
      setTab={setTab}
    ></BeatmapsTab>,
    <RulesTab setTab={setTab} request={request}></RulesTab>,
    <RequestTab />,
  ];

  if (!queueContext.data || !queueContext.requests) return <></>;

  function auxClosePanel(ev: any) {
    if (ev.target.className != "requestpanel open") return;

    setOpen(!open);

    return;
  }

  function escClosePanel(ev: any) {
    if (ev.target.className != "requestpanel open") return;
    if (ev.key != "escape") return;

    setOpen(false);

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
          {getLocalization(login.language, ["requestPanel", "title"])}
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
            {getLocalization(login.language, [
              "requestPanel",
              "tabs",
              "beatmaps",
            ])}
          </div>
          <div
            className={tab == 1 ? "option selected" : "option"}
            onClick={() => {
              setTab(1);
            }}
          >
            {getLocalization(login.language, ["requestPanel", "tabs", "rules"])}
          </div>
          <div
            className={tab == 2 ? "option selected" : "option"}
            onClick={() => {
              if (!rulesRead)
                return enqueueSnackbar(
                  "You must read the rules before request!",
                  {
                    variant: "error",
                  }
                );

              if (request.beatmap.id == -1 || !request.beatmap.id) return;
              setTab(2);
            }}
          >
            {getLocalization(login.language, [
              "requestPanel",
              "tabs",
              "request",
            ])}
          </div>
        </div>
        {tabs[tab]}
      </div>
    </div>
  );
};
