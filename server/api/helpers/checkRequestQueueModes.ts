import { queues, requests } from "../../../database";
import { Beatmapset } from "../../../src/types/beatmap";

export default (queue: any, beatmapset: Beatmapset) => {
  if (!beatmapset.beatmaps) return false;

  let pass = false;

  beatmapset.beatmaps.forEach((b) => {
    if (queue.modes.includes(b.mode_int)) pass = true;
  });

  return pass;
};
