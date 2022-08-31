import { createContext, useContext, useState } from "react";

export type RequestContextType = {
  request: any;
  setRequest: (request: any) => void;
};

export const RequestContext = createContext<RequestContextType>({
  request: {
    comment: "",
    status: "pending",
    beatmap: {},
  },
  setRequest: (request) => console.warn("Invalid side menu action"),
});

export const RequestContextProvider = ({ children }: any) => {
  const [request, setRequest] = useState({
    comment: "",
    status: "pending",
    beatmap: {},
  });

  return (
    <RequestContext.Provider value={{ request, setRequest }}>
      {children}
    </RequestContext.Provider>
  );
};
