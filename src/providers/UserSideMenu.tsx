import { createContext, useContext, useState } from "react";

export type SideMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const UserSideMenuContext = createContext<SideMenuContextType>({
  open: false,
  setOpen: (theme) => console.warn("Invalid side menu action"),
});

export const UserSideMenuProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <UserSideMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </UserSideMenuContext.Provider>
  );
};

export const useTheme = () => useContext(UserSideMenuContext);
