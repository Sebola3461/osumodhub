import React, { createContext, useState, FC, useEffect } from "react";
import { ILoginUser } from "../types/user";

const defaultUser = JSON.stringify({
  _id: "-1",
  authenticated: false,
  username: "Guest",
  hasQueue: false,
});

function getStoredUser(): ILoginUser {
  let user = JSON.parse(defaultUser);

  try {
    user = JSON.parse(localStorage["user_login"]);

    if (!user) return JSON.parse(defaultUser);

    if (typeof JSON.parse(localStorage["user_login"]) == "string")
      return JSON.parse(defaultUser);

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
  const [oldLogin, setOldLogin] = useState<any>(null);
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
