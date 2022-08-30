import { createContext, useContext, useState } from "react";

export type ConfirmDialogContextType = {
  open: any;
  data: {
    title: string;
    text: string;
    displayCancel: boolean;
    defaultValue: string;
    placeholder: string;
  };
  type: number;
  setOpen: (_v: any) => any;
  action: any;
  setAction: (_v: any) => any;
  displayCancel: boolean;
  setDisplayCancel: (_v: boolean) => any;
  setText: () => any;
  setConfirm: () => any;
  setData: (_v: any) => any;
};

export const ConfirmDialogContext = createContext<ConfirmDialogContextType>({
  open: false,
  type: 0,
  setOpen: (_v) => console.warn("Invalid action"),
  action: (_v) => console.warn("Invalid action"),
  setAction: (_v) => console.warn("Invalid action"),
  displayCancel: true,
  setDisplayCancel: (_v) => console.warn("Invalid action"),
  setData: (_v) => console.warn("Invalid action"),
  setText: () => console.warn("Invalid action"),
  setConfirm: () => console.warn("Invalid action"),
  data: {
    title: "Are you sure?",
    text: "This action is irreversible!",
    displayCancel: true,
    defaultValue: "",
    placeholder: "",
  },
});

let action = () => {};
export const ConfirmDialogProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [displayCancel, setDisplayCancel] = useState(true);
  const [data, setData] = useState({
    title: "Are you sure?",
    text: "This action is irreversible!",
    placeholder: "",
    defaultValue: "",
    displayCancel: true,
  });
  const [type, setType] = useState(0);

  function setAction(f: any) {
    action = f;
  }

  function setText() {
    setType(1);
  }

  function setConfirm() {
    setType(0);
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
        type,
        setText,
        setConfirm,
      }}
    >
      {children}
    </ConfirmDialogContext.Provider>
  );
};
