import { useNavigate } from "react-router-dom";
import { Beatmapset } from "../../types/beatmap";
import CatchIcon from "../icons/CatchIcon";
import ManiaIcon from "../icons/ManiaIcon";
import OsuIcon from "../icons/OsuIcon";
import TaikoIcon from "../icons/TaikoIcon";
import "./../../styles/RequestSelector.css";
import SpreadViewer from "./SpreadViewer";
import Tag from "./Tag";
import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  SubMenu,
} from "./../../libs/react-contextmenu/es6/";
import {
  faChevronUp,
  faCircleCheck,
  faClock,
  faDownload,
  faExternalLinkSquare,
  faLitecoinSign,
  faMessage,
  faMusic,
  faPause,
  faPlay,
  faRandom,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { useSnackbar } from "notistack";
import { ManageRequestPanelContext } from "../../providers/ManageRequestPanelContext";
import ReactTip from "@jswork/react-tip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BeatmapPreviewContext } from "../../providers/BeatmapPreviewContext";
import {
  SelectedRequestContext,
  SelectedRequestContextProvider,
} from "../../providers/SelectRequestContext";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import timeString from "../../helpers/timeString";

export interface IRequest {
  _id: string;
  _queue: string;
  _owner: string;
  _owner_name: string;
  comment: string;
  reply: string;
  beatmapset_id: number;
  beatmap: Beatmapset;
  status: string;
  date: Date;
  mfm: boolean;
  cross: boolean;
}

export default ({
  request,
  queue,
  _static,
  refreshRequests,
  requests,
  setRequests,
}: {
  request: IRequest;
  queue: any;
  _static?: boolean;
  refreshRequests?: any;
  requests?: any[];
  setRequests?: any;
}) => {
  const icons = [OsuIcon, TaikoIcon, CatchIcon, ManiaIcon];
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const manageRequestPanelContext = useContext(ManageRequestPanelContext);
  const beatmapPreviewContext = useContext(BeatmapPreviewContext);
  const selectedRequest = useContext(SelectedRequestContext);
  const [queueRequests, setQueueRequests] = useState(requests);
  const [_request, setRequest] = useState<any>(
    !request
      ? {
          beatmap: {
            covers: {},
            beatmaps: [],
          },
        }
      : request
  );

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

  useEffect(() => {
    setRequest(request);
  }, []);

  useEffect(() => {
    setQueueRequests(requests);
  }, [requests]);

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  const texts: { [key: string]: string } = {
    pending: "Pending",
    rechecking: "Need Recheck",
    waiting: "Waiting another BN",
    finished: "Finished",
    nominated: "Nominated",
    rejected: "Rejected",
    accepted: "Accepted",
    archived: "Archived",
  };

  function updateRequest(opt: any) {
    if (selectedRequest.selected.length != 0)
      return manageAllSelectedRequests(opt.status);

    setLoading(true);

    fetch(`/api/requests/${opt.request._id}`, {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: login.account_token,
      },
      body: JSON.stringify({
        reply: "",
        status: opt.status,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        setLoading(false);
        if (res.status == 200) {
          _request.status = opt.status;
          enqueueSnackbar("Request status updated!", {
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

  async function manageAllSelectedRequests(_status: string) {
    if (
      !confirm(
        _status == "delete"
          ? `Are you sure? ${selectedRequest.selected.length} requests will be deleted.`
          : `Are you sure? ${selectedRequest.selected.length} requests will recive the status ${texts[_status]}`
      )
    )
      return;

    for (const id of selectedRequest.selected) {
      await fetch(`/api/requests/${id}`, {
        method: _status == "delete" ? "delete" : "put",
        headers: {
          "content-type": "application/json",
          authorization: login.account_token,
        },
        body:
          _status == "delete"
            ? null
            : JSON.stringify({
                reply: "",
                status: _status,
              }),
      });
    }

    let _requests = queueRequests;
    for (const id of selectedRequest.selected) {
      if (queueRequests) {
        if (_status == "delete") {
          _requests = _requests.filter((r) => r._id != id);
        } else {
          const _requests = requests.map((r) => r);
          const i = _requests.findIndex((r) => r._id == id);

          _requests[i]["status"] = _status;
        }
      }
    }

    setRequests(_requests);
    selectedRequest.setSelected([]);

    enqueueSnackbar("Requests updated!", {
      variant: "success",
    });
  }

  function deleteRequest(opt: any) {
    if (selectedRequest.selected.length != 0)
      return manageAllSelectedRequests("delete");

    if (!confirm("Are you sure?")) return;

    setLoading(true);
    fetch(`/api/requests/${opt.request._id}`, {
      method: "delete",
      headers: {
        "content-type": "application/json",
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.status == 200) {
          _request.status = opt.status;
          enqueueSnackbar("Request deleted!", {
            variant: "success",
            persist: false,
            action,
          });

          if (refreshRequests) {
            refreshRequests();
          }
        } else {
          enqueueSnackbar(res.message, {
            variant: "error",
            persist: false,
            action,
          });
        }
      });
  }

  if (_request.beatmap.beatmaps) {
    _request.beatmap.beatmaps.sort(
      (a: any, b: any) => a.difficulty_rating - b.difficulty_rating
    );
  }

  function openExternal(url: string) {
    window.open(url);
  }

  const modder_options = [
    <MenuItem
      data={{
        request: _request,
        status: "accepted",
      }}
      onClick={() => {
        updateRequest({
          request: _request,
          status: "accepted",
        });
      }}
      className="accept-hover"
    >
      Accept
    </MenuItem>,
    <MenuItem
      data={{
        request: _request,
        status: "rejected",
      }}
      onClick={() => {
        updateRequest({
          request: _request,
          status: "rejected",
        });
      }}
      className="reject-hover"
    >
      Reject
    </MenuItem>,
    <MenuItem
      data={{
        request: _request,
        status: "finished",
      }}
      onClick={() => {
        updateRequest({
          request: _request,
          status: "finished",
        });
      }}
      className="finish-hover"
    >
      Finish
    </MenuItem>,
    <MenuItem
      data={{
        request: _request,
        status: "archived",
      }}
      onClick={() => {
        updateRequest({
          request: _request,
          status: "archived",
        });
      }}
      className="archive-hover"
    >
      Archive
    </MenuItem>,
    <MenuItem
      data={{
        request: _request,
        status: "deleted",
      }}
      onClick={() => {
        deleteRequest({
          request: _request,
          status: "deleted",
        });
      }}
      className="delete-hover"
    >
      Delete
    </MenuItem>,
  ];

  const bn_options = [
    <MenuItem
      data={{
        request: _request,
        status: "accepted",
      }}
      onClick={() => {
        updateRequest({
          request: _request,
          status: "accepted",
        });
      }}
      className="accept-hover"
    >
      Accept
    </MenuItem>,
    <MenuItem
      data={{
        request: _request,
        status: "rejected",
      }}
      onClick={() => {
        updateRequest({
          request: _request,
          status: "rejected",
        });
      }}
      className="reject-hover"
    >
      Reject
    </MenuItem>,
    <MenuItem
      data={{
        request: _request,
        status: "nominated",
      }}
      onClick={() => {
        updateRequest({
          request: _request,
          status: "nominated",
        });
      }}
      className="nominate-hover"
    >
      Nominated
    </MenuItem>,
    <MenuItem
      data={{
        request: _request,
        status: "waiting",
      }}
      onClick={() => {
        updateRequest({
          request: _request,
          status: "waiting",
        });
      }}
      className="wait-hover"
    >
      Waiting another BN
    </MenuItem>,
    <MenuItem
      data={{
        request: _request,
        status: "rechecking",
      }}
      onClick={() => {
        updateRequest({
          request: _request,
          status: "rechecking",
        });
      }}
      className="recheck-hover"
    >
      Need Recheck
    </MenuItem>,
    <MenuItem
      data={{
        request: _request,
        status: "archived",
      }}
      onClick={() => {
        updateRequest({
          request: _request,
          status: "archived",
        });
      }}
      className="archive-hover"
    >
      Archive
    </MenuItem>,
    <MenuItem
      data={{
        request: _request,
        status: "deleted",
      }}
      onClick={() => {
        deleteRequest({
          request: _request,
          status: "deleted",
        });
      }}
      className="delete-hover"
    >
      Delete
    </MenuItem>,
  ];

  function manageRequest(request: any, ev: any) {
    if (ev.target.className == "action" || _static) return;

    if (ev.ctrlKey) return selectedRequest.selectRequest(request._id);

    if (selectedRequest.selected.includes(request._id))
      return selectedRequest.removeSelectedRequest(request._id);

    manageRequestPanelContext.setRequest(request);
    manageRequestPanelContext.setOpen(true);
  }

  function editRequestComment() {
    const content = prompt("Provide a new comment");

    if (content == null) return;
    if (content.trim() == "")
      return enqueueSnackbar("Invalid comment!", {
        variant: "error",
      });

    fetch(`/api/requests/${_request._id}/edit?comment=${content.trim()}`, {
      method: "post",
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
        });

        if (d.status == 200) {
          _request.comment = content.trim();
          const _requests = requests.map((r) => r);
          const i = _requests.findIndex((r) => r._id == _request._id);

          _requests[i]["comment"] = content.trim();

          setRequests(_requests);
        }
      });
  }

  function getContextMenu() {
    if (_static) return;

    const extraMenu = (
      <SubMenu title="More">
        <MenuItem
          className="finish-hover"
          onClick={() => {
            openExternal(`https://osu.ppy.sh/s/${_request.beatmapset_id}`);
          }}
        >
          Beatmap page
        </MenuItem>
        <MenuItem
          className="finish-hover"
          onClick={() => {
            openExternal(
              `https://osu.ppy.sh/beatmapsets/${_request.beatmapset_id}/discussion`
            );
          }}
        >
          Beatmap discussion
        </MenuItem>
        <MenuItem
          className="finish-hover"
          onClick={() => {
            openExternal(`osu://s/${_request.beatmapset_id}`);
          }}
        >
          osu!direct
        </MenuItem>
      </SubMenu>
    );

    if (login._id == _request._owner) {
      bn_options.push(
        <MenuItem className="wait-hover" onClick={editRequestComment}>
          Edit comment
        </MenuItem>
      );

      modder_options.push(
        <MenuItem className="wait-hover" onClick={editRequestComment}>
          Edit comment
        </MenuItem>
      );
    }

    if (queue.type == "modder" && login._id == queue._id)
      return (
        <ContextMenu id={`request-${_request._id}`}>
          {modder_options.map((o) => {
            return o;
          })}
          {extraMenu}
        </ContextMenu>
      );

    if (["BN", "NAT"].includes(queue.type) && login._id == queue._id)
      return (
        <ContextMenu id={`request-${_request._id}`}>
          {modder_options.map((o) => {
            return o;
          })}
          {extraMenu}
        </ContextMenu>
      );

    if (login._id == _request._owner)
      return (
        <ContextMenu id={`request-${_request._id}`}>
          <MenuItem className="wait-hover" onClick={editRequestComment}>
            Edit comment
          </MenuItem>
          {extraMenu}
        </ContextMenu>
      );
  }

  const [playing, setPlaying] = useState(false);
  const previewTag = useRef(
    new Audio(`https://b.ppy.sh/preview/${_request.beatmapset_id}.mp3`)
  );

  useEffect(() => {
    previewTag.current.src = `https://b.ppy.sh/preview/${_request.beatmapset_id}.mp3`;
  }, [_request]);

  useEffect(() => {
    if (beatmapPreviewContext.targetRequest != _request._id) {
      previewTag.current.pause();
    }
  }, [beatmapPreviewContext.paused]);

  useEffect(() => {
    const handler = () => setPlaying(false);
    previewTag.current.addEventListener("ended", handler);
    return () => previewTag.current.removeEventListener("ended", handler);
  }, [previewTag.current]);

  useEffect(() => {
    previewTag.current[playing ? "play" : "pause"]();
  }, [playing]);

  previewTag.current.volume = beatmapPreviewContext.volume;
  previewTag.current.ontimeupdate = (ev: any) => {
    beatmapPreviewContext.setPosition(
      beatmapPreviewContext.position < 98
        ? (ev.path[0].currentTime / ev.path[0].duration) * 100
        : 0
    );
  };
  previewTag.current.onended = (ev: any) => {
    beatmapPreviewContext.setPosition(0);
    beatmapPreviewContext.setPause(true);
    beatmapPreviewContext.setTargetRequest("");
  };
  previewTag.current.onpause = (ev: any) => {
    console.log("pause");
    beatmapPreviewContext.setPause(true);
  };
  previewTag.current.onplay = (ev: any) => {
    beatmapPreviewContext.setTargetRequest(_request._id);
    beatmapPreviewContext.setPause(false);
  };

  return (
    <>
      <SelectedRequestContextProvider>
        <ContextMenuTrigger id={`request-${_request._id}`}>
          <div
            className={loading ? "requestselector loading" : "requestselector"}
            onClick={(ev: any) => {
              manageRequest(_request, ev);
            }}
          >
            <div
              className={
                selectedRequest.selected.includes(_request._id)
                  ? "selected-overlay visible"
                  : "selected-overlay"
              }
            ></div>
            <div
              className="banner"
              style={{
                backgroundImage: `url(${_request.beatmap.covers["cover@2x"]})`,
              }}
            >
              <div className="row">
                {_request.cross ? (
                  <div
                    className="crossrequesticon"
                    aria-label={`Requested by ${_request._owner_name}`}
                    data-balloon-pos="up"
                    data-balloon-length="medium"
                  >
                    <FontAwesomeIcon icon={faRandom} />
                  </div>
                ) : (
                  <></>
                )}

                <div
                  aria-label={_request.reply}
                  data-balloon-pos={_request.reply != "" ? "up" : "hidden"}
                  data-balloon-length="fit"
                >
                  <Tag
                    content={texts[_request.status]}
                    type={_request.status}
                    icon={
                      request.reply != "" ? (
                        <FontAwesomeIcon icon={faChevronUp} />
                      ) : (
                        <></>
                      )
                    }
                  ></Tag>
                </div>
              </div>
              <div className="actions">
                <div
                  onClick={() => {
                    openExternal(
                      `https://osu.ppy.sh/s/${_request.beatmapset_id}`
                    );
                  }}
                  className="action"
                >
                  <FontAwesomeIcon icon={faExternalLinkSquare} />
                </div>
                <div
                  className="action"
                  onClick={() => {
                    openExternal(`osu://s/${_request.beatmapset_id}`);
                  }}
                >
                  <FontAwesomeIcon icon={faDownload} />
                </div>
                <div
                  className="action"
                  onClick={() => {
                    if (
                      beatmapPreviewContext.position == 0 ||
                      beatmapPreviewContext.paused
                    ) {
                      return previewTag.current.play();
                    } else {
                      return previewTag.current.pause();
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={
                      !beatmapPreviewContext.paused &&
                      beatmapPreviewContext.targetRequest == _request._id
                        ? faPause
                        : faPlay
                    }
                  />
                </div>
              </div>
              <div
                className="preview-progress"
                style={{
                  width: `${
                    beatmapPreviewContext.targetRequest == _request._id
                      ? beatmapPreviewContext.position
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="attributes">
              <div>
                <FontAwesomeIcon icon={faMusic} />
                <p>{_request.beatmap.bpm}bpm</p>
              </div>
              <div>
                <FontAwesomeIcon icon={faClock} />
                <p>
                  {timeString(
                    _request.beatmap.beatmaps
                      ? _request.beatmap.beatmaps[0].hit_length
                      : 0
                  )}
                </p>
              </div>
              <div>
                <FontAwesomeIcon icon={faPlay} />
                <p>{_request.beatmap.play_count}</p>
              </div>
            </div>
            {!request.beatmap.beatmaps ? (
              <></>
            ) : (
              <SpreadViewer
                beatmaps={_request.beatmap.beatmaps || []}
              ></SpreadViewer>
            )}
            <p className="title">{_request.beatmap.title}</p>
            <p className="artist">{_request.beatmap.artist}</p>
            <p className="mapper">
              mapped by
              <a href={`https://osu.ppy.sh/u/${_request.beatmap.user_id}`}>
                {_request.beatmap.creator}
              </a>
            </p>
            <div className="commentlabel">
              <FontAwesomeIcon icon={faMessage} />
              Mapper's comment
            </div>
            <div className="comment">{_request.comment}</div>
          </div>
        </ContextMenuTrigger>
        {getContextMenu()}
      </SelectedRequestContextProvider>
    </>
  );
};
