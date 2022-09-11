import { createContext, useContext, useState } from "react";

export type QueueGroupsSideMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const QueueGroupsSideMenuContext =
  createContext<QueueGroupsSideMenuContextType>({
    open: false,
    setOpen: (open) => console.warn("Invalid side menu action"),
  });

export const QueueGroupsSideMenuProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <QueueGroupsSideMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </QueueGroupsSideMenuContext.Provider>
  );
};

export const useTheme = () => useContext(QueueGroupsSideMenuContext);
