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
} from "../../libs/react-contextmenu/es6";
import { faLitecoinSign } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { useSnackbar } from "notistack";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";

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

export default ({ request }: { request: IRequest }) => {
  const icons = [OsuIcon, TaikoIcon, CatchIcon, ManiaIcon];
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [_request, setRequest] = useState<any>({
    queue: {},
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

  if (_request.beatmap.status == "Not Found") return <></>;

  return (
    <>
      <div className={loading ? "requestselector loading" : "requestselector"}>
        <div
          className="banner"
          style={{
            backgroundImage: `url(${_request.beatmap.covers["cover@2x"]})`,
          }}
        >
          <Tag content={texts[_request.status]} type={_request.status}></Tag>
        </div>
        <SpreadViewer
          beatmaps={_request.beatmap.beatmaps || []}
          key={GenerateComponentKey(10)}
        ></SpreadViewer>
        <p className="title">{_request.beatmap.title}</p>
        <p className="artist">{_request.beatmap.artist}</p>
        <p className="mapper">
          requested to
          <a href={`/queue/${_request.queue._id}`}>{_request.queue.name}</a>
        </p>
        <div className="comment">{_request.comment}</div>
      </div>
    </>
  );
};
