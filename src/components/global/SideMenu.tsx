import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StartAuthentication from "../../helpers/StartAuthentication";
import { AuthContext } from "../../providers/AuthContext";
import "./../../styles/SideMenu.css";

export default ({
  title,
  open,
  options,
}: {
  title: string;
  open: boolean;
  options: { label: string; callback: Function }[];
}) => {
  const [state, setState] = useState({
    title,
    open: open.toString(),
    options,
  });

  function closePanel() {
    state.open = "false";
    setState(state);
  }

  return (
    <div className={"sidemenu"} onClick={closePanel}>
      <div className="container">
        <div className="title">
          <p>{title}</p>
        </div>
        <div className="options">
          {options.map((opt) => {
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
