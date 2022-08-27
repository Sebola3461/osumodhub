import { createContext, useContext, useEffect, useState } from "react";

export type ManageGDPanelContextType = {
  open: any;
  setOpen: (_v: any) => void;
  gd: undefined | any;
  setGD: (_v: any) => void;
};

export const ManageGDPanelContext = createContext<ManageGDPanelContextType>({
  open: false,
  setOpen: (_v) => console.warn("Invalid action"),
  gd: undefined,
  setGD: (_v) => console.warn("Invalid action"),
});

export const ManageGDPanelProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [gd, setGD] = useState<any | undefined>(undefined);

  return (
    <ManageGDPanelContext.Provider value={{ open, setOpen, gd, setGD }}>
      {children}
    </ManageGDPanelContext.Provider>
  );
};
