import { createContext, useContext, useState } from "react";
import { IQueue, IQueueRequest } from "../types/queue";
import { ConfirmDialogContext } from "./ConfirmDialogContext";
import { QueueContext } from "./QueueContext";

export interface RequestWsData {
  type: string;
  data: any;
}

export type RequestWsContextType = {
  queue: string[];
  addToQueue: (request: IQueueRequest) => void;
  processData: (request: RequestWsData) => void;
};

export const RequestWsContext = createContext<RequestWsContextType>({
  queue: [],
  addToQueue: (request: IQueueRequest) => console.warn("Invalid action"),
  processData: (request: RequestWsData) => console.warn("Invalid action"),
});

export const RequestWsProvider = ({ children }: any) => {
  const [queue, setQueue] = useState<string[]>([]);
  const queueContext = useContext(QueueContext);
  const dialog = useContext(ConfirmDialogContext);

  function addToQueue(request: IQueueRequest) {
    console.log("Recived new WS message, adding to queue");

    if (
      queue.length == 0 ||
      !queue.find((r) => {
        return r == request._id;
      })
    ) {
      queue.push(request._id);

      setQueue(queue);
    }
  }

  function processData(request: RequestWsData) {
    console.log("Recived new WS message, processing...");

    if (queue.includes(request.data._id))
      return console.log(
        "Skipping recived WS message cuz the aux queue has this id!"
      );

    if (request.data._queue != queueContext.data._id) return;

    if (request.type == "request:new")
      return addNewRequestToQueue(request.data);

    if (request.type == "request:update") updateRequest(request.data);

    if (request.type == "queue:update") updateQueueData(request.data);
  }

  function addNewRequestToQueue(request: IQueueRequest) {
    if (request._queue != queueContext.data._id) return;
    console.log("Inserting a new request into queue...");

    queueContext.requests.unshift(request);
    queueContext.setRequests(JSON.parse(JSON.stringify(queueContext.requests)));
  }

  function updateQueueData(queue: IQueue) {
    if (queue._id != queueContext.data._id) return;
    console.log("Updating queue data..");

    function setup() {
      dialog.setConfirm();
      dialog.setData({
        title: "We have some updates!",
        text: queue.open
          ? `The queue owner has open this queue! Today is your lucky day, you can request beatmaps here now!`
          : `The queue owner has closed this queue! You can't request a beatmap here right now. But you can check requests normally`,
      });
      dialog.setAction(() => {});
      dialog.setDisplayCancel(false);
      dialog.setOpen(true);

      setQueue(queue);
    }

    setup();
  }

  function updateRequest(request: IQueueRequest) {
    if (request._queue != queueContext.data._id) return;

    console.log("Updating request by WS message...");

    request.isWs = true;

    const requestIndex = queueContext.requests.findIndex(
      (r) => r._id == request._id
    );

    if (requestIndex == -1) return;

    queueContext.requests[requestIndex] = request;
    queueContext.setRequests(JSON.parse(JSON.stringify(queueContext.requests)));
  }

  return (
    <RequestWsContext.Provider value={{ queue, addToQueue, processData }}>
      {children}
    </RequestWsContext.Provider>
  );
};
