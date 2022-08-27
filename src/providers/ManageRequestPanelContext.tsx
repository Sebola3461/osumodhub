import { createContext, useContext, useEffect, useState } from "react";

export type ManageRequestPanelContextType = {
  open: any;
  request: any;
  setOpen: (_v: any) => void;
  setRequest: (_v: any) => void;
};

export const ManageRequestPanelContext =
  createContext<ManageRequestPanelContextType>({
    open: false,
    request: {
      comment: "No comment provided...",
      status: "pending",
      beatmap: {
        covers: {},
      },
    },
    setOpen: (_v) => console.warn("Invalid action"),
    setRequest: (_v: any) => console.warn("sexo"),
  });

export const ManageRequestPanelProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<any>({
    comment: "No comment provided...",
    status: "pending",
    beatmap: {
      covers: {},
    },
  });

  return (
    <ManageRequestPanelContext.Provider
      value={{ request, open, setOpen, setRequest }}
    >
      {children}
    </ManageRequestPanelContext.Provider>
  );
};
