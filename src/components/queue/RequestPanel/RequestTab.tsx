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
import { lastManagedRequestContext } from "../../../providers/LastManagedRequestContext";
import { addToUpdateQueue } from "../../../helpers/RequestUpdateQueue";
import { QueueContext } from "../../../providers/QueueContext";

export default () => {
  const { user, updateUser } = useContext(AuthContext);
  const { request, setRequest } = useContext(RequestContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { open, setOpen } = useContext(RequestPanelContext);
  const { lastManagedRequest, setLastManagedRequest } = useContext(
    lastManagedRequestContext
  );

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

          addToUpdateQueue(res.data._id);
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
    <div className={loading ? "requesttab loading" : "requesttab"}>
      <div
        className="banner"
        style={{
          backgroundImage: `url(${request.beatmap.covers["cover@2x"]})`,
        }}
      >
        <div className="overlay">
          <div className="metadata">
            <p className="title">{request.beatmap.title}</p>
            <p className="artist">{request.beatmap.artist}</p>
          </div>
          <SpreadViewer
            beatmaps={request.beatmap.beatmaps.sort(
              (a, b) => a.difficulty_rating - b.difficulty_rating
            )}
          ></SpreadViewer>
        </div>
      </div>
      <p className="commenttitle">
        <FontAwesomeIcon icon={faMessage} /> Comment
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
        Request
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
