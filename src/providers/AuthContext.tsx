import React, { createContext, useState, FC } from "react";

const contextDefaultValues: any = {
  user: getStoredUser(),
  addTodo: () => {},
};

function getStoredUser() {
  let user: any = {
    _id: -1,
    authenticated: false,
    username: "Guest",
    hasQueue: false,
  };

  try {
    user = JSON.parse(localStorage["user_login"]);

    if (!user)
      user = {
        _id: -1,
        authenticated: false,
        username: "Guest",
        hasQueue: false,
      };
  } catch (e) {
    user = user;
  }

  return user;
}

export const AuthContext = createContext<any>(contextDefaultValues);

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(contextDefaultValues.user);

  const updateUser = (user: any) => setUser(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
