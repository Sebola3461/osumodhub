import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../providers/AuthContext";
import { RequestContext } from "../../../providers/RequestContext";
import Markdown from "markdown-to-jsx";
import RequestSelector from "../../global/RequestSelector";
import "./../../../styles/RequestTab.css";
import { useSnackbar } from "notistack";
import SpreadViewer from "../../global/SpreadViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { RequestPanelContext } from "../../../providers/RequestPanelContext";
import { QueueContext } from "../../../providers/QueueContext";
import { RequestWsContext } from "../../../providers/RequestWsQueueContext";
import BeatmapsetBanner from "../../panels/BeatmapsetBanner";
import {
  getDictionary,
  getLocalization,
} from "../../../localization/localizationManager";
import { Checkbox } from "@mui/material";

export default () => {
  const { login, setLogin } = useContext(AuthContext);
  const { request, setRequest } = useContext(RequestContext);

  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { open, setOpen } = useContext(RequestPanelContext);
  const [notify, setNotify] = useState(false);

  const queueContext = useContext(QueueContext);

  const action = (key) => (
    <>
      <button
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        X
      </button>
    </>
  );

  function requestBeatmap() {
    setLoading(true);
    fetch(`/api/queues/${queueContext.data._id}/requests`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: login.account_token,
      },
      body: JSON.stringify({
        comment: request.comment,
        beatmapset_id: request.beatmap.id,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        setLoading(false);
        if (res.status == 200) {
          enqueueSnackbar("Beatmap requested!", {
            variant: "success",
            persist: false,
            action,
          });

          subscribeForNotifications(res.data._id);
        } else {
          enqueueSnackbar(res.message, {
            variant: "error",
            persist: false,
            action,
          });
        }
      });
  }

  function subscribeForNotifications(request_id: string | number) {
    fetch(`/api/requests/${request_id}/subscribe`, {
      method: "POST",
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status == 200) {
          setNotify(false);
        }
      });
  }

  function setRequestComment(ev: any) {
    request.comment = ev.target.value.trim();

    setRequest(JSON.parse(JSON.stringify(request)));
  }

  function handleNotifyChange(ev: any) {
    setNotify(ev.target.checked);
  }

  return (
    <div
      className={
        loading ? "requesttab customscroll loading" : "requesttab customscroll"
      }
    >
      <BeatmapsetBanner request={request} />
      <p className="commenttitle">
        <FontAwesomeIcon icon={faMessage} />{" "}
        {getDictionary(login.language).requestPanel.request.commentTitle}
      </p>
      <textarea
        className="comment"
        defaultValue={request.comment}
        onInput={setRequestComment}
      ></textarea>
      <div className="notify-container">
        <div className="action">
          <Checkbox defaultChecked={notify} onChange={handleNotifyChange} />{" "}
          Notify-me ingame for updates
        </div>
        <button
          className="green"
          onClick={() => {
            requestBeatmap();
          }}
        >
          {getDictionary(login.language).requestPanel.request.confirm}
        </button>
      </div>

      {/* <RequestSelector
        request={request}
        queue={queue}
        _static={true}
      ></RequestSelector>
      <div className="vertical">
        <div className="rules">
          <Markdown>{queue.description}</Markdown>
        </div>
        <div className="row inputs">
          <input
            placeholder="Add a comment"
            onInput={(ev) => {
              updateRequestComment(ev);
            }}
          ></input>
          <button
            className="green"
            onClick={() => {
              requestBeatmap();
            }}
          >
            Send
          </button>
        </div>
      </div> */}
    </div>
  );
};
