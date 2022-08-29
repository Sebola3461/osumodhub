import { websocketServer } from "../routes";

export default (request: any) => {
  websocketServer.emit("message", {
    type: "request",
    data: request,
  });
};
