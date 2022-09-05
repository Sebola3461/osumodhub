import { createContext, useState } from "react";
import { IQueue, IQueueRequest } from "../types/queue";

export type QueueContextType = {
  data: IQueue | undefined;
  requests: IQueueRequest[] | undefined;
  followers: number;
  following: boolean;
  setData: (d: IQueue) => any;
  setFollowers: (d: number) => any;
  setFollowing: (d: boolean) => any;
  setRequests: (d: IQueueRequest[]) => any;
};

export const QueueContext = createContext<QueueContextType>({
  data: undefined,
  requests: undefined,
  setData: (_v) => console.warn("Invalid action"),
  setRequests: (_v) => console.warn("Invalid action"),
  followers: 0,
  following: false,
  setFollowers: (_v: number) => console.warn("Invalid action"),
  setFollowing: (_v: boolean) => console.warn("Invalid action"),
});

export const QueueProvider = ({ children }: any) => {
  const [data, setData] = useState<IQueue | undefined>();
  const [requests, setRequests] = useState<IQueueRequest[] | undefined>();
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<boolean>(false);

  return (
    <QueueContext.Provider
      value={{
        data,
        setData,
        requests,
        setRequests,
        followers,
        setFollowers,
        following,
        setFollowing,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};
