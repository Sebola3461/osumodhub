import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StartAuthentication from "../../helpers/StartAuthentication";
import { AuthContext } from "../../providers/AuthContext";
import { SideMenuContext } from "../../providers/UserSideMenu";
import "./../../styles/SideMenu.css";

export default ({
  title,
  _open,
  options,
}: {
  title: string;
  _open: boolean;
  options: { label: string; callback: Function }[];
}) => {
  const { open, setOpen } = useContext(SideMenuContext);

  useEffect(() => {
    setOpen(_open);
  }, [open]);

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
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
