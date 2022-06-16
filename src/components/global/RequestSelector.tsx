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
} from "./../../libs/react-contextmenu/es6/";
import { faChevronUp, faLitecoinSign } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { useSnackbar } from "notistack";
import { ManageRequestPanelContext } from "../../providers/ManageRequestPanelContext";
import ReactTip from "@jswork/react-tip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
}: {
  request: IRequest;
  queue: any;
  _static?: boolean;
  refreshRequests?: any;
}) => {
  const icons = [OsuIcon, TaikoIcon, CatchIcon, ManiaIcon];
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const manageRequestPanelContext = useContext(ManageRequestPanelContext);
  const [_request, setRequest] = useState<any>({
    beatmap: {
      covers: {},
      beatmaps: [],
    },
  });

  useEffect(() => {
    setRequest(request);
  }, []);

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  function updateRequest(opt: any) {
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
          });
        } else {
          enqueueSnackbar(res.message, {
            variant: "error",
            persist: false,
          });
        }
      });
  }

  function deleteRequest(opt: any) {
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
          });

          if (refreshRequests) {
            refreshRequests();
          }
        } else {
          enqueueSnackbar(res.message, {
            variant: "error",
            persist: false,
          });
        }
      });
  }

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

  if (_request.beatmap.beatmaps) {
    _request.beatmap.beatmaps.sort(
      (a: any, b: any) => a.difficulty_rating - b.difficulty_rating
    );
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
  ];

  function manageRequest(request: any) {
    if (login._id != request._queue) return;

    manageRequestPanelContext.setRequest(request);
    manageRequestPanelContext.setOpen(true);
  }

  return (
    <>
      <ContextMenuTrigger id={`request-${_request._id}`}>
        <div
          className={loading ? "requestselector loading" : "requestselector"}
          onClick={() => {
            manageRequest(_request);
          }}
        >
          <div
            className="banner"
            style={{
              backgroundImage: `url(${_request.beatmap.covers["cover@2x"]})`,
            }}
          >
            <div
              aria-label={_request.reply}
              data-balloon-pos="up"
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
          <SpreadViewer
            beatmaps={_request.beatmap.beatmaps || []}
          ></SpreadViewer>
          <p className="title">{_request.beatmap.title}</p>
          <p className="artist">{_request.beatmap.artist}</p>
          <p className="mapper">
            mapped by
            <a href={`https://osu.ppy.sh/u/${_request.beatmap.user_id}`}>
              {_request.beatmap.creator}
            </a>
          </p>
          <div className="comment">{_request.comment}</div>
        </div>
      </ContextMenuTrigger>
      {queue._id == login._id && !_static ? (
        <ContextMenu id={`request-${_request._id}`}>
          {queue.type == "modder"
            ? modder_options.map((o) => o)
            : bn_options.map((o) => o)}
        </ContextMenu>
      ) : (
        ""
      )}
    </>
  );
};
