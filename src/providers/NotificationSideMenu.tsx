import { createContext, useContext, useState } from "react";

export type NotificationSideMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const NotificationSideMenuContext =
  createContext<NotificationSideMenuContextType>({
    open: false,
    setOpen: (theme) => console.warn("Invalid side menu action"),
  });

export const NotificationSideMenuProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <NotificationSideMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </NotificationSideMenuContext.Provider>
  );
};

export const useTheme = () => useContext(NotificationSideMenuContext);
