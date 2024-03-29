import { useContext, useEffect, useState } from "react";
import { RequestContext } from "../../providers/RequestContext";
import { Beatmapset } from "../../types/beatmap";
import "./../../styles/BeatmapSelector.css";

export default ({
  beatmapset,
  selected,
  onClick,
  style,
}: {
  beatmapset: Beatmapset;
  selected: number;
  onClick: any;
  style?: React.CSSProperties;
}) => {
  const { request, setRequest } = useContext(RequestContext);
  const [_selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(selected == beatmapset.id);
    console.log(selected);
  }, [selected]);

  return (
    <div
      className={_selected ? "beatmapselector selected" : "beatmapselector"}
      style={Object.assign(
        {
          backgroundImage: `url(${beatmapset.covers["card@2x"]})`,
        },
        style || {}
      )}
      onClick={() => {
        onClick(beatmapset.id);

        request.beatmap = beatmapset;
        setRequest(request);
      }}
      id={`beatmap-selector-${beatmapset.id}`}
    >
      <div className="content">
        <p className="title">{beatmapset.title}</p>
        <p className="artist">{beatmapset.artist}</p>
        <div className="spread"></div>
      </div>
    </div>
  );
};
