import { useContext, useEffect, useState } from "react";
import { GenerateComponentKey } from "../../../helpers/GenerateComponentKey";
import GetBeatmapsetID from "../../../helpers/GetBeatmapsetID";
import { AuthContext } from "../../../providers/AuthContext";
import { RequestContext } from "../../../providers/RequestContext";
import { Beatmapset } from "../../../types/beatmap";
import BeatmapSelector from "../../global/BeatmapSelector";
import "./../../../styles/BeatmapsTab.css";
import { useSnackbar } from "notistack";

export default ({
  setUserBeatmaps,
  userBeatmaps,
  queue,
}: {
  userBeatmaps: Beatmapset[];
  setUserBeatmaps: any;
  queue: any;
}) => {
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const [loading, setLoading] = useState(false);
  const { request, setRequest } = useContext(RequestContext);
  const [selected, setSelected] = useState(request.beatmap.id);
  const [beatmapFetch, setBeatmapFetch] = useState<any>("0");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function fetchBeatmap() {
    const url = new URL(beatmapFetch);

    if (url.host != "osu.ppy.sh")
      return enqueueSnackbar("This isn't an osu! beatmap url!", {
        variant: "error",
      });

    const id = GetBeatmapsetID(url.pathname);

    setLoading(true);
    fetch(`/api/beatmaps/${id}`, {
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        setLoading(false);
        if (d.status != 200)
          return enqueueSnackbar(d.message, {
            variant: "error",
          });

        userBeatmaps.unshift(d.data);
        setUserBeatmaps(userBeatmaps);
      });
  }

  return (
    <div className={loading ? "beatmapstab loading" : "beatmapstab"}>
      {!queue.allow.cross ? (
        <></>
      ) : (
        <div className="beatmapinput">
          <input
            type="text"
            placeholder="Paste beatmapset url here"
            onInput={(ev: any) => {
              setBeatmapFetch(ev.target.value);
            }}
          />
          <button className="search" onClick={fetchBeatmap}>
            Fetch
          </button>
        </div>
      )}
      <div className="beatmaps">
        {userBeatmaps.map((b) => (
          <BeatmapSelector
            beatmapset={b}
            selected={selected}
            onClick={setSelected}
          ></BeatmapSelector>
        ))}
      </div>
    </div>
  );
};
