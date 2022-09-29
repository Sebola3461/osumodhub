import { websocketServer } from "../routes";

export default (queue: any) => {
  websocketServer.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "queue:update",
        data: queue,
      })
    );
  });
};
