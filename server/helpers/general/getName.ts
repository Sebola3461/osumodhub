export function getName(queue: any) {
  if (queue.type == "group") return queue.name;

  if (
    queue.name.toLowerCase().endsWith("s") ||
    queue.name.toLowerCase().endsWith("x")
  )
    return queue.name.concat("'");

  return queue.name.concat("'s");
}
