import { createContext, useState } from "react";

export type MyRequestPanelContextType = {
  open: any;
  setOpen: (_v: any) => void;
};

export const MyRequestPanelContext = createContext<MyRequestPanelContextType>({
  open: false,
  setOpen: (_v) => console.warn("Invalid menu action"),
});

export const MyRequestsPanelProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <MyRequestPanelContext.Provider value={{ open, setOpen }}>
      {children}
    </MyRequestPanelContext.Provider>
  );
};
