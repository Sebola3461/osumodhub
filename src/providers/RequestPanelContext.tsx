import { createContext, useContext, useState } from "react";

export type RequestPanelContextType = {
  open: any;
  rulesRead: boolean;
  setOpen: (_v: any) => void;
  setRulesRead: (_v: any) => void;
};

export const RequestPanelContext = createContext<RequestPanelContextType>({
  open: false,
  rulesRead: false,
  setOpen: (_v) => console.warn("Invalid action"),
  setRulesRead: (_v) => console.warn("Invalid action"),
});

export const RequestPanelProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [rulesRead, setRulesRead] = useState(false);

  return (
    <RequestPanelContext.Provider
      value={{ open, setOpen, rulesRead, setRulesRead }}
    >
      {children}
    </RequestPanelContext.Provider>
  );
};
