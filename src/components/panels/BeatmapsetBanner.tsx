import { IQueueRequest } from "../../types/queue";
import SpreadViewer from "../global/SpreadViewer";
import Tag from "../global/Tag";
import "./../../styles/BeatmapsetBanner.css";

export default ({
  request,
  status,
}: {
  request: IQueueRequest;
  status?: string;
}) => {
  const texts: { [key: string]: string } = {
    pending: "Pending",
    rechecking: "Need Recheck",
    waiting: "Waiting another BN",
    finished: "Modded",
    nominated: "Nominated",
    ranked: "Ranked",
    rejected: "Rejected",
    accepted: "Accepted",
    archived: "Archived",
  };

  return (
    <div
      className="beatmapsetbanner"
      style={{
        backgroundImage: `url(${request.beatmap.covers["cover@2x"]})`,
      }}
    >
      <div className="overlay">
        {status ? (
          <div className="row meta">
            <SpreadViewer
              beatmaps={request.beatmap.beatmaps.sort(
                (a, b) => a.difficulty_rating - b.difficulty_rating
              )}
            />
            <Tag content={texts[status]} type={status} />
          </div>
        ) : (
          <></>
        )}
        <div className="metadata">
          <p className="title">{request.beatmap.title}</p>
          <p className="artist">{request.beatmap.artist}</p>
        </div>
        {status ? (
          <></>
        ) : (
          <SpreadViewer
            beatmaps={request.beatmap.beatmaps.sort(
              (a, b) => a.difficulty_rating - b.difficulty_rating
            )}
          ></SpreadViewer>
        )}
      </div>
    </div>
  );
};
