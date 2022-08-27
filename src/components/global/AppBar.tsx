import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import StartAuthentication from "../../helpers/StartAuthentication";
import { AuthContext } from "../../providers/AuthContext";
import { NotificationSideMenuContext } from "../../providers/NotificationSideMenu";
import { SideMenuContext } from "../../providers/UserSideMenu";
import "./../../styles/AppBar.css";

export default () => {
  const { user, updateUser } = useContext(AuthContext);
  const sideMenuContext = useContext(SideMenuContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const notificationSideMenuContext = useContext(NotificationSideMenuContext);

  useEffect(() => {
    setLogin(JSON.parse(user));
  }, [user]);

  useEffect(() => {
    sideMenuContext.setOpen(true);
  }, []);

  return (
    <div id="appbar" className="background2">
      <Link to="/modding">
        <div className="logo"></div>
      </Link>
      <div className="links-row">
        <Link to="/modding" className="anchor1 page-anchor">
          Queues
        </Link>
        <a href="https://discord.gg/fpE4YmtRqz" className="anchor1 page-anchor">
          Discord
        </a>
        <a
          href="https://github.com/Sebola3461/osumodhub"
          className="anchor1 page-anchor"
        >
          GitHub
        </a>
      </div>
      <div className="right-content">
        {login._id == -1 ? (
          <button onClick={StartAuthentication}>Log-in</button>
        ) : (
          <div
            className="avatar"
            onClick={() => {
              login._id == -1
                ? StartAuthentication()
                : sideMenuContext.setOpen(!sideMenuContext.open);
            }}
            style={{
              backgroundImage: `url(https://a.ppy.sh/${login._id})`,
            }}
          ></div>
        )}
        {login._id == -1 ? (
          <></>
        ) : (
          <div
            className="notification-button"
            onClick={() => {
              notificationSideMenuContext.setOpen(
                !notificationSideMenuContext.open
              );
            }}
          >
            <>
              <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
              <p>{notificationSideMenuContext.size}</p>
            </>
          </div>
        )}
      </div>
    </div>
  );
};
