import { createContext, useContext, useEffect, useState } from "react";
import { IQueueRequest } from "../types/queue";

export type ManageRequestPanelContextType = {
  open: boolean;
  request: IQueueRequest | undefined;
  setOpen: (_v: boolean) => void;
  setRequest: (_v: IQueueRequest) => void;
};

export const ManageRequestPanelContext =
  createContext<ManageRequestPanelContextType>({
    open: false,
    request: undefined,
    setOpen: (_v) => console.warn("Invalid action"),
    setRequest: (_v: any) => console.warn("sexo"),
  });

export const ManageRequestPanelProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<IQueueRequest | undefined>(undefined);

  return (
    <ManageRequestPanelContext.Provider
      value={{ request, open, setOpen, setRequest }}
    >
      {children}
    </ManageRequestPanelContext.Provider>
  );
};
