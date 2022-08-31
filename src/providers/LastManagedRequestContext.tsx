import { createContext, useContext, useState } from "react";

export type LastManagedRequestContextType = {
  lastManagedRequest: string[];
  setLastManagedRequest: (lastManagedRequest: string) => void;
};

export const lastManagedRequestContext =
  createContext<LastManagedRequestContextType>({
    lastManagedRequest: [],
    setLastManagedRequest: (setLastManagedRequest) =>
      console.warn("Invalid action"),
  });

export const LastManagedRequestProvider = ({ children }: any) => {
  const [lastManagedRequest, _setLastManagedRequest] = useState([]);

  function setLastManagedRequest(r: string) {
    if (!lastManagedRequest.includes(r)) {
      lastManagedRequest.push(r);
    }
  }

  return (
    <lastManagedRequestContext.Provider
      value={{ lastManagedRequest, setLastManagedRequest }}
    >
      {children}
    </lastManagedRequestContext.Provider>
  );
};
