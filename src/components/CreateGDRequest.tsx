import {
  faFileEdit,
  faMusic,
  faTimes,
  faUserTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Beatmapset } from "../types/beatmap";
import "./../styles/CreateGDPanel.scss";
import { BeatmapsTab } from "./queue/CreateGDPanel/BeatmapsTab";
import { DifficultyCreationTab } from "./queue/CreateGDPanel/DifficultyCreationTab";

export function CreateGDRequest() {
  const [tab, setTab] = useState(0);
  const [beatmap, setBeatmap] = useState<Beatmapset | null>(null);

  const tabs = [
    <BeatmapsTab
      beatmap={beatmap}
      setBeatmap={setBeatmap}
      tab={tab}
      setTab={setTab}
    />,
    <DifficultyCreationTab beatmap={beatmap} />,
  ];

  return (
    <div className="create-gd-panel">
      <div className="container">
        <div className="_title">
          <FontAwesomeIcon icon={faUserTag} className="icon" />
          Create new GD
          <FontAwesomeIcon icon={faTimes} className="close" />
        </div>
        <div className="tabs-container">
          <div
            className={tab == 0 ? "tab-selector selected" : "tab-selector"}
            onClick={() => {
              setTab(0);
            }}
          >
            <FontAwesomeIcon icon={faMusic} /> Beatmaps
          </div>
          <div
            className={tab == 1 ? "tab-selector selected" : "tab-selector"}
            onClick={() => {
              setTab(1);
            }}
          >
            <FontAwesomeIcon icon={faFileEdit} />
            Difficulties
          </div>
        </div>
        {tabs[tab]}
      </div>
    </div>
  );
}
