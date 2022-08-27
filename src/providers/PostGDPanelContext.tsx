import { createContext, useContext, useState } from "react";

export type PostGDPanelContextType = {
  open: any;
  setOpen: (_v: any) => void;
};

export const PostGDPanelContext = createContext<PostGDPanelContextType>({
  open: false,
  setOpen: (_v) => console.warn("Invalid action"),
});

export const PostGDPanelProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <PostGDPanelContext.Provider value={{ open, setOpen }}>
      {children}
    </PostGDPanelContext.Provider>
  );
};
