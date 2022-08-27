import { createContext, useContext, useEffect, useState } from "react";

export type GDPanelContextType = {
  open: any;
  setOpen: (_v: any) => void;
  gd: undefined | any;
  setGD: (_v: any) => void;
};

export const GDPanelContext = createContext<GDPanelContextType>({
  open: false,
  setOpen: (_v) => console.warn("Invalid action"),
  gd: undefined,
  setGD: (_v) => console.warn("Invalid action"),
});

export const GDPanelProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [gd, setGD] = useState<any | undefined>(undefined);

  return (
    <GDPanelContext.Provider value={{ open, setOpen, gd, setGD }}>
      {children}
    </GDPanelContext.Provider>
  );
};
