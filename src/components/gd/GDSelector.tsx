import * as d3 from "d3";
import CatchIcon from "../icons/CatchIcon";
import ManiaIcon from "../icons/ManiaIcon";
import OsuIcon from "../icons/OsuIcon";
import TaikoIcon from "../icons/TaikoIcon";
import "./../../styles/GDSelector.css";

export interface IGDRequest {
  _id: string;
  _owner: string;
  _owner_name: string;
  comment: string;
  beatmapset_id: number;
  difficulties: {
    id: string;
    min_sr: number;
    max_sr: number;
    mode: number;
    name: string;
    user: number | null;
    username: string | null;
    updated_at: Date;
  }[];
  beatmap: {
    id: number;
    artist: string;
    title: string;
    covers: {
      cover: string;
      "cover@2x": string;
      card: string;
      "card@2x": string;
      list: string;
      "list@2x": string;
      slimcover: string;
      "slimcover@2x": string;
    };
    creator: string;
  };
  genres: string[];
  tags: string[];
  modes: number[];
  date: Date;
  pending: boolean;
}

export default ({
  request,
  onClick,
}: {
  onClick?: any;
  request: IGDRequest;
}) => {
  const icons = [OsuIcon, TaikoIcon, CatchIcon, ManiaIcon];

  const difficultyColourSpectrum = d3
    .scaleLinear<string>()
    .domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
    .clamp(true)
    .range([
      "#4290FB",
      "#4FC0FF",
      "#4FFFD5",
      "#7CFF4F",
      "#F6F05C",
      "#FF8068",
      "#FF4E6F",
      "#C645B8",
      "#6563DE",
      "#18158E",
      "#000000",
    ])
    .interpolate(d3.interpolateRgb.gamma(2.2));

  return (
    <div
      className="gdselector"
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <div
        className="bigbanner"
        style={{
          backgroundImage: `url(${request.beatmap.covers["cover@2x"]})`,
        }}
      ></div>
      <p className="title">{request.beatmap.title}</p>
      <p className="artist">{request.beatmap.artist}</p>
      <p className="host">
        hosted by <span>{request.beatmap.creator}</span>
      </p>
      <div className="difficulties">
        {request.difficulties.map((d) => {
          const Icon = icons[d.mode];

          return (
            <div className={d.user ? "difficulty claimed" : "difficulty"}>
              <Icon
                width="30px"
                height="30px"
                color={difficultyColourSpectrum(d.max_sr)}
              />
              <div className="metadata">
                <p className="name">{d.name}</p>
                {!d.user ? <></> : <p className="mapper">claimed </p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
