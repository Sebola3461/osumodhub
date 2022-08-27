import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../providers/AuthContext";
import BeatmapSelector from "../../global/BeatmapSelector";

export default ({
  beatmaps,
  setTab,
  selected,
  setSelected,
  post,
  setPost,
}: {
  beatmaps: any[];
  setTab: any;
  selected: number;
  setSelected: any;
  post: any;
  setPost: any;
}) => {
  return (
    <div className="beatmapstab">
      {beatmaps.map((b) => {
        return (
          <BeatmapSelector
            beatmapset={b}
            selected={selected}
            onClick={() => {
              setSelected(b.id);
              setTab(1);

              post.beatmap = b;
              setPost(post);
            }}
          />
        );
      })}
    </div>
  );
};
