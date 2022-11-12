import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../providers/AuthContext";
import { Beatmapset } from "../../../types/beatmap";
import BeatmapSelector from "../../global/BeatmapSelector";
import LoadingComponent from "../../global/LoadingComponent";
import NoRequests from "../../global/NoRequests";
import "./../../../styles/panels/CreateGDPanelBeatmapsTab.scss";

export function BeatmapsTab({ tab, setTab, beatmap, setBeatmap }) {
  const [beatmaps, setBeatmaps] = useState<Beatmapset[] | null>(null);
  const { login } = useContext(AuthContext);

  useEffect(() => {
    fetch(`/api/users/${login._id}/beatmaps?wip=true&graveyard=true`, {
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        console.log(d);
        if (d.status == 200) {
          setBeatmaps(d.data);
        }
      });
  }, []);

  function handleBeatmapClick(id: number) {
    setBeatmap(beatmaps.find((b) => b.id == 1865604));
    setTab(1);
  }

  if (!beatmaps)
    return (
      <div className="creategdpanel-beatmaps-tab">
        <LoadingComponent text="Loading beatmaps..." />
      </div>
    );

  if (beatmaps.length == 0)
    return (
      <div className="creategdpanel-beatmaps-tab">
        <NoRequests text="You don't have any beatmap..." />
      </div>
    );

  return (
    <div className="creategdpanel-beatmaps-tab customscroll">
      {beatmaps.map((b) => (
        <BeatmapSelector
          beatmapset={b}
          onClick={handleBeatmapClick}
          selected={beatmap ? beatmap._id : ""}
        />
      ))}
    </div>
  );
}
