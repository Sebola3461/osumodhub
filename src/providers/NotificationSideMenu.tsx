import { createContext, useContext, useEffect, useState } from "react";

export type NotificationSideMenuContextType = {
  open: boolean;
  pending: boolean;
  size: number;
  setPending: (pending: boolean) => void;
  setOpen: (open: boolean) => void;
  setSize: (size: number) => void;
};

export const NotificationSideMenuContext =
  createContext<NotificationSideMenuContextType>({
    open: false,
    pending: false,
    size: 0,
    setSize: (theme) => console.warn("Invalid side menu action"),
    setPending: (theme) => console.warn("Invalid side menu action"),
    setOpen: (theme) => console.warn("Invalid side menu action"),
  });

export const NotificationSideMenuProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (open == true) {
      setPending(false);
    }
  }, [open]);

  return (
    <NotificationSideMenuContext.Provider
      value={{ open, pending, setPending, setOpen, size, setSize }}
    >
      {children}
    </NotificationSideMenuContext.Provider>
  );
};

export const useTheme = () => useContext(NotificationSideMenuContext);
