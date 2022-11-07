import React, { useContext, useEffect, useState, Context } from "react";
import { Link, useNavigate } from "react-router-dom";
import StartAuthentication from "../../helpers/StartAuthentication";
import { AuthContext } from "../../providers/AuthContext";
import { UserSideMenuContext } from "../../providers/UserSideMenu";
import "./../../styles/SideMenu.css";

export default ({
  title,
  context,
  options,
  customComponents,
}: {
  title: string;
  context: Context<any>;
  options: { label: string; callback: Function }[];
  customComponents?: any[];
}) => {
  const { open, setOpen } = useContext(context);

  function closePanel() {
    setOpen(!open);

    return;
  }

  function auxClosePanel(ev: any) {
    console.log(ev.target);
    if (ev.target.className != "sidemenu open") return;

    setOpen(!open);

    return;
  }

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  return (
    <div
      className={open ? "sidemenu open" : "sidemenu closed"}
      style={{ opacity: open ? "1" : "0" }}
      onClick={(ev) => {
        auxClosePanel(ev);
      }}
    >
      <div className="container">
        <div className="title">
          <p>{title}</p>
        </div>
        <div className="options">
          {options.map((opt, i) => {
            return (
              <div
                className="option"
                onClick={() => {
                  closePanel();
                  opt.callback();
                }}
                key={i}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
        {customComponents ? customComponents.map((c, i) => c) : <></>}
      </div>
    </div>
  );
};
