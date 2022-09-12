import { requests } from "../../../database";
import { websocketServer } from "../routes";

export default async (request: any) => {
  const updatedRequest = await requests.findById(request._id);

  websocketServer.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "request:update",
        data: updatedRequest,
      })
    );
  });
};
