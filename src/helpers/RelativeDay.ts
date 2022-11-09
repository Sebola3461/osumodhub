export function RelativeDay(a: Date, b: Date) {
  let MS_PER_DAY = 1000 * 60 * 60 * 24;

  //Ignore time and timezone
  let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}
