import { useNavigate } from "react-router-dom";
import { Beatmapset } from "../../types/beatmap";
import CatchIcon from "../icons/CatchIcon";
import ManiaIcon from "../icons/ManiaIcon";
import OsuIcon from "../icons/OsuIcon";
import TaikoIcon from "../icons/TaikoIcon";
import "./../../styles/RequestSelector.css";
import SpreadViewer from "./SpreadViewer";
import Tag from "./Tag";

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

  if (request.beatmap.beatmaps) {
    request.beatmap.beatmaps.sort(
      (a, b) => a.difficulty_rating - b.difficulty_rating
    );
  }

  return (
    <div className="requestselector">
      <div
        className="banner"
        style={{
          backgroundImage: `url(${request.beatmap.covers["cover@2x"]})`,
        }}
      >
        <Tag content={texts[request.status]} type={request.status}></Tag>
      </div>
      <SpreadViewer beatmaps={request.beatmap.beatmaps || []}></SpreadViewer>
      <p className="title">{request.beatmap.title}</p>
      <p className="artist">{request.beatmap.artist}</p>
      <div className="comment">{request.comment}</div>
    </div>
  );
};
