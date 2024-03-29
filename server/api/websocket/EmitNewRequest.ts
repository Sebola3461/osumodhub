import { websocketServer } from "../routes";

export default (request: any) => {
  websocketServer.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "request:new",
        data: request,
      })
    );
  });
};
