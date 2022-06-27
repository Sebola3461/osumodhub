import { createContext, useContext, useEffect, useState } from "react";

function getStoredFilters() {
  let filters: any = {
    type: "any",
    open: "any",
    mode: "any",
    sort: "ab",
    query: "",
  };

  try {
    filters = JSON.parse(localStorage["home_search"]);

    if (!filters)
      filters = {
        type: "any",
        open: "any",
        mode: "any",
        sort: "ab",
        query: "",
      };
  } catch (e: any) {
    filters = filters;
  }

  return filters;
}

export type HomeFilterContextType = {
  filters: {
    type: string;
    open: string;
    mode: string;
    sort: string;
    query: string;
  };
  updateFilters: (_v: any) => void;
};

export const HomeFilterContext = createContext<HomeFilterContextType>({
  filters: getStoredFilters(),
  updateFilters: (_v: any) => {},
});

export const HomeFilterContextProvider = ({ children }: any) => {
  const [filters, _updateFilters] = useState(getStoredFilters());

  function updateFilters(_v) {
    localStorage.setItem("home_search", JSON.stringify(_v));
    _updateFilters(_v);
  }

  return (
    <HomeFilterContext.Provider value={{ filters, updateFilters }}>
      {children}
    </HomeFilterContext.Provider>
  );
};
