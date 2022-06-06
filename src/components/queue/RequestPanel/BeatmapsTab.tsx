import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../providers/AuthContext";
import { RequestContext } from "../../../providers/RequestContext";
import { Beatmapset } from "../../../types/beatmap";
import BeatmapSelector from "../../global/BeatmapSelector";
import "./../../../styles/BeatmapsTab.css";

export default ({ userBeatmaps }: { userBeatmaps: Beatmapset[] }) => {
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const { request, setRequest } = useContext(RequestContext);
  const [selected, setSelected] = useState(request.beatmap.id);

  return (
    <div className="beatmapstab">
      {userBeatmaps.length > 0
        ? userBeatmaps.map((b) => (
            <BeatmapSelector
              beatmapset={b}
              selected={selected}
              onClick={setSelected}
            ></BeatmapSelector>
          ))
        : void {}}
    </div>
  );
};
