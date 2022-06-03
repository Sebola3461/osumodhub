import { createContext, useContext, useState } from "react";

export type SideMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const SideMenuContext = createContext<SideMenuContextType>({
  open: false,
  setOpen: (theme) => console.warn("Invalid side menu action"),
});

export const SideMenuProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <SideMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </SideMenuContext.Provider>
  );
};

export const useTheme = () => useContext(SideMenuContext);
