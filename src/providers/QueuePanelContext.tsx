import { createContext, useState } from "react";

export type QueuePanelContextType = {
  open: any;
  setOpen: (_v: any) => void;
};

export const QueuePanelContext = createContext<QueuePanelContextType>({
  open: false,
  setOpen: (_v) => console.warn("Invalid side menu action"),
});

export const QueuePanelProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <QueuePanelContext.Provider value={{ open, setOpen }}>
      {children}
    </QueuePanelContext.Provider>
  );
};
