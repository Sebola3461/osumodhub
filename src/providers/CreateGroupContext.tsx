import { createContext, useContext, useState } from "react";

export type CreateGroupPanelContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const CreateGroupPanelContext =
  createContext<CreateGroupPanelContextType>({
    open: false,
    setOpen: (open) => console.warn("Invalid menu action"),
  });

export const CreateGroupPanelProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <CreateGroupPanelContext.Provider value={{ open, setOpen }}>
      {children}
    </CreateGroupPanelContext.Provider>
  );
};
