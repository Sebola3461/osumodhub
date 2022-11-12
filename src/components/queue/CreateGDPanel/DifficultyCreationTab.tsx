import { useState } from "react";
import { Beatmapset } from "../../../types/beatmap";
import "./../../../styles/panels/DifficultyCreationTab.scss";

/**
 * id
 * stars
 * mode
 * name
 * user
 * queue
 */

export function DifficultyCreationTab({ beatmap }: { beatmap: Beatmapset }) {
  const [difficulties, setDifficulties] = useState([]);

  function addDifficulty(data: any) {
    difficulties.push(data);

    difficulties.sort((a, b) => a.stars - b.stars);

    setDifficulties(difficulties);
  }

  return (
    <div className="creategdpanel-difficulty-creation-tab">
      <div className="difficulty-input">
        <p className="container-title">
          Create Difficulty <span></span>
        </p>
        <input type="text" />
        <input type="number" />
        <input type="select" />
      </div>
    </div>
  );
}
