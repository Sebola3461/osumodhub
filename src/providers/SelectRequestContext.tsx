import { createContext, useContext, useState } from "react";

export type SelectedRequestContextType = {
  selected: string[];
  setSelected: (request: any) => void;
  selectRequest: (request: any) => void;
  removeSelectedRequest: (request: any) => void;
};

export const SelectedRequestContext = createContext<SelectedRequestContextType>(
  {
    selected: [],
    setSelected: (request) => console.warn("Invalid menu action"),
    selectRequest: (request) => console.warn("Invalid menu action"),
    removeSelectedRequest: (request) => console.warn("Invalid menu action"),
  }
);

export const SelectedRequestContextProvider = ({ children }: any) => {
  const [selected, setSelected] = useState([]);

  function selectRequest(id: string) {
    const _new = selected.map((s) => s);

    if (!_new.includes(id)) {
      _new.push(id);
      setSelected(_new);
    }
  }

  function removeSelectedRequest(id: string) {
    const _new = selected.filter((s) => s != id);

    setSelected(_new);
  }

  return (
    <SelectedRequestContext.Provider
      value={{ selected, setSelected, selectRequest, removeSelectedRequest }}
    >
      {children}
    </SelectedRequestContext.Provider>
  );
};
