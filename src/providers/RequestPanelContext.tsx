import { createContext, useContext, useState } from "react";

export type RequestPanelContextType = {
  open: any;
  setOpen: (_v: any) => void;
};

export const RequestPanelContext = createContext<RequestPanelContextType>({
  open: false,
  setOpen: (_v) => console.warn("Invalid side menu action"),
});

export const RequestPanelProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <RequestPanelContext.Provider value={{ open, setOpen }}>
      {children}
    </RequestPanelContext.Provider>
  );
};
