import { createContext, useContext, useState } from "react";

export type ConfirmDialogContextType = {
  open: any;
  data: {
    title: string;
    text: string;
    displayCancel: boolean;
  };
  setOpen: (_v: any) => any;
  action: any;
  setAction: (_v: any) => any;
  displayCancel: boolean;
  setDisplayCancel: (_v: boolean) => any;
  setData: (_v: any) => any;
};

export const ConfirmDialogContext = createContext<ConfirmDialogContextType>({
  open: false,
  setOpen: (_v) => console.warn("Invalid action"),
  action: (_v) => console.warn("Invalid action"),
  setAction: (_v) => console.warn("Invalid action"),
  displayCancel: true,
  setDisplayCancel: (_v) => console.warn("Invalid action"),
  setData: (_v) => console.warn("Invalid action"),
  data: {
    title: "Are you sure?",
    text: "This action is irreversible!",
    displayCancel: true,
  },
});

let action = () => {};
export const ConfirmDialogProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [displayCancel, setDisplayCancel] = useState(true);
  const [data, setData] = useState({
    title: "Are you sure?",
    text: "This action is irreversible!",
    displayCancel: true,
  });

  function setAction(f: any) {
    action = f;
  }

  return (
    <ConfirmDialogContext.Provider
      value={{
        open,
        setOpen,
        action,
        setAction,
        data,
        setData,
        displayCancel,
        setDisplayCancel,
      }}
    >
      {children}
    </ConfirmDialogContext.Provider>
  );
};
