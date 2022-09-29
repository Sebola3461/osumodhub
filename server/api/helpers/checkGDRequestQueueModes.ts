import { queues, requests } from "../../../database";
import { Beatmapset } from "../../../src/types/beatmap";

export default (queue: any, difficulties: any[]) => {
  let pass = false;

  difficulties.forEach((b) => {
    if (queue.modes.includes(b.mode)) pass = true;
  });

  return pass;
};
