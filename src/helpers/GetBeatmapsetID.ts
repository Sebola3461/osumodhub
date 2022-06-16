export default (url: string) => {
  // https://osu.ppy.sh/beatmapsets/1419088#taiko/2923535

  return url.split("/").pop();
};
