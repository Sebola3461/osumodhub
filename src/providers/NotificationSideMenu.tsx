import { createContext, useContext, useEffect, useState } from "react";

export type NotificationSideMenuContextType = {
  open: boolean;
  pending: boolean;
  setPending: (pending: boolean) => void;
  setOpen: (open: boolean) => void;
};

export const NotificationSideMenuContext =
  createContext<NotificationSideMenuContextType>({
    open: false,
    pending: false,
    setPending: (theme) => console.warn("Invalid side menu action"),
    setOpen: (theme) => console.warn("Invalid side menu action"),
  });

export const NotificationSideMenuProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open == true) {
      setPending(false);
    }
  }, [open]);

  return (
    <NotificationSideMenuContext.Provider
      value={{ open, pending, setPending, setOpen }}
    >
      {children}
    </NotificationSideMenuContext.Provider>
  );
};

export const useTheme = () => useContext(NotificationSideMenuContext);
