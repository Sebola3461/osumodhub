export function addToUpdateQueue(d: string) {
  if (!globalThis.updateQueue.includes(d)) {
    globalThis.updateQueue.push(d);
  }
}
