import { Beatmap } from "./../../types/beatmap";
import * as d3 from "d3";
import CatchIcon from "../icons/CatchIcon";
import ManiaIcon from "../icons/ManiaIcon";
import OsuIcon from "../icons/OsuIcon";
import TaikoIcon from "../icons/TaikoIcon";
import "./../../styles/SpreadViewer.css";

export default ({
  beatmaps,
  style,
}: {
  beatmaps: any[];
  style?: React.CSSProperties;
}) => {
  const modes = {
    osu: 0,
    taiko: 1,
    fruits: 2,
    mania: 3,
  };
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
    <div className="spreadviewer" style={style || {}}>
      {beatmaps.map((b, i) => {
        const Icon = icons[modes[b.mode]];

        return (
          <div
            style={{
              width: "1.2rem",
              height: "1.2rem",
            }}
            key={i}
          >
            <Icon
              color={difficultyColourSpectrum(b.difficulty_rating)}
              width="1.2rem"
              height="1.2rem"
            ></Icon>
          </div>
        );
      })}
    </div>
  );
};
