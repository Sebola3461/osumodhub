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
import { getLocalization } from "../../../localization/localizationManager";

export default () => {
  const { login, setLogin } = useContext(AuthContext);
  const { request, setRequest } = useContext(RequestContext);

  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { open, setOpen } = useContext(RequestPanelContext);

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
        } else {
          enqueueSnackbar(res.message, {
            variant: "error",
            persist: false,
            action,
          });
        }
      });
  }

  function setRequestComment(ev: any) {
    request.comment = ev.target.value.trim();

    setRequest(JSON.parse(JSON.stringify(request)));
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
        {getLocalization(login.language, [
          "requestPanel",
          "request",
          "commentTitle",
        ])}
      </p>
      <textarea
        className="comment"
        defaultValue={request.comment}
        onInput={setRequestComment}
      ></textarea>
      <button
        className="green"
        onClick={() => {
          requestBeatmap();
        }}
      >
        {getLocalization(login.language, [
          "requestPanel",
          "request",
          "confirm",
        ])}
      </button>
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
