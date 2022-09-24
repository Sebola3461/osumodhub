import React, { createContext, useState, FC, useEffect } from "react";
import { ILoginUser } from "../types/user";

const defaultUser = JSON.stringify({
  _id: "-1",
  authenticated: false,
  username: "Guest",
  hasQueue: false,
});

function getStoredUser(): ILoginUser {
  let user: any = defaultUser;

  try {
    user = JSON.parse(localStorage["user_login"]);

    if (!user) user = defaultUser;
    if (typeof JSON.parse(localStorage["user_login"]) == "string")
      user = defaultUser;

    console.log();

    return user;
  } catch (e: any) {
    localStorage["user_login"] = undefined;

    user = JSON.parse(defaultUser);
  }

  return JSON.parse(user);
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
