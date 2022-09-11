import { useContext, useEffect, useState } from "react";
import { GenerateComponentKey } from "../../../helpers/GenerateComponentKey";
import GetBeatmapsetID from "../../../helpers/GetBeatmapsetID";
import { AuthContext } from "../../../providers/AuthContext";
import { RequestContext } from "../../../providers/RequestContext";
import { Beatmapset } from "../../../types/beatmap";
import BeatmapSelector from "../../global/BeatmapSelector";
import "./../../../styles/BeatmapsTab.css";
import { useSnackbar } from "notistack";
import { QueueContext } from "../../../providers/QueueContext";
import isQueueManager from "../../../helpers/isQueueManager";

export default ({
  setUserBeatmaps,
  userBeatmaps,
  setTab,
}: {
  userBeatmaps: Beatmapset[];
  setUserBeatmaps: any;
  setTab: any;
}) => {
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const [loading, setLoading] = useState(false);
  const { request, setRequest } = useContext(RequestContext);
  const [selected, setSelected] = useState(request.beatmap.id);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const queueContext = useContext(QueueContext);

  const action = (key) => (
    <>
      <button
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        X
      </button>
    </>
  );

  let beatmapFetch = "0";

  function fetchBeatmap() {
    const url = new URL(beatmapFetch);

    if (url.host != "osu.ppy.sh")
      return enqueueSnackbar("This isn't an osu! beatmap url!", {
        variant: "error",
        action,
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
            action,
          });

        userBeatmaps.unshift(d.data);
        setUserBeatmaps(userBeatmaps);
        setSelected(d.data.id);
        request.beatmap = d.data;
        setRequest(request);
        setTab(1);
      });
  }

  const search = (
    <div className="beatmapinput">
      <input
        type="text"
        placeholder="Paste beatmapset url here"
        onInput={(ev: any) => {
          beatmapFetch = ev.target.value;
        }}
      />
      <button className="search" onClick={fetchBeatmap}>
        Fetch
      </button>
    </div>
  );

  function selectBeatmap(b: any) {
    setSelected(b);
    setTab(1);
  }

  function getCrossRequestInput() {
    if (
      !queueContext.data.allow.cross &&
      !isQueueManager(queueContext.data, login)
    )
      return <></>;

    return search;
  }

  return (
    <div className={loading ? "beatmapstab loading" : "beatmapstab"}>
      {getCrossRequestInput()}
      <div className="beatmaps">
        {userBeatmaps.map((b, i) => (
          <BeatmapSelector
            beatmapset={b}
            selected={selected}
            onClick={selectBeatmap}
            key={GenerateComponentKey(10)}
            style={{
              animationDelay: `${100 * (i + 1)}ms`,
            }}
          ></BeatmapSelector>
        ))}
      </div>
    </div>
  );
};
