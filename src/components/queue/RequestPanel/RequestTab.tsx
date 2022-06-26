import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../providers/AuthContext";
import { RequestContext } from "../../../providers/RequestContext";
import Markdown from "markdown-to-jsx";
import RequestSelector from "../../global/RequestSelector";
import "./../../../styles/RequestTab.css";
import { useSnackbar } from "notistack";

export default ({
  queue,
  requests,
  setRequests,
}: {
  queue: any;
  setRequests: any;
  requests: any[];
}) => {
  const { user, updateUser } = useContext(AuthContext);
  const { request, setRequest } = useContext(RequestContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function updateRequestComment(ev: any) {
    request.comment = ev.target.value;
    setRequest(request);
  }

  function requestBeatmap() {
    setLoading(true);
    fetch(`/api/queues/${queue._id}/requests`, {
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
          });

          request._id = res.data._id;
          requests.unshift(res.data);
          setRequests(requests);
        } else {
          enqueueSnackbar(res.message, {
            variant: "error",
            persist: false,
          });
        }
      });
  }

  return (
    <div className={loading ? "requesttab loading" : "requesttab"}>
      <RequestSelector
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
            defaultValue={
              request.comment == "No comment provided..." ? "" : request.comment
            }
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
      </div>
    </div>
  );
};
