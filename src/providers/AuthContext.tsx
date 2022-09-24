import React, { createContext, useState, FC, useEffect } from "react";
import { ILoginUser } from "../types/user";

const defaultUser = JSON.stringify({
  _id: "-1",
  authenticated: false,
  username: "Guest",
  hasQueue: false,
  color: "#2196f3",
});

function getStoredUser(): ILoginUser {
  let user = JSON.parse(defaultUser);

  try {
    user = JSON.parse(localStorage["user_login"]);

    if (!user) return JSON.parse(defaultUser);

    if (typeof JSON.parse(localStorage["user_login"]) == "string")
      return JSON.parse(defaultUser);

    if (!user.color) user.color = "#2196f3";

    return user;
  } catch (e: any) {
    console.error(e);
    localStorage.removeItem("user_login");

    return JSON.parse(defaultUser);
  }
}

interface IUserContextType {
  login: ILoginUser;
  setLogin: (u) => any;
}

export const AuthContext = createContext<IUserContextType>({
  login: JSON.parse(defaultUser),
  setLogin: (u: any) => void {},
});

const AuthProvider = ({ children }: any) => {
  const [login, setLogin] = useState<ILoginUser>(getStoredUser());

  return (
    <AuthContext.Provider
      value={{
        login,
        setLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
