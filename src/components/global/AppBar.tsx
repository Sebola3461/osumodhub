import {
  faBell,
  faChevronCircleDown,
  faCircleChevronDown,
  faCircleChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import { hexToRGB } from "../../helpers/hexToRGB";
import StartAuthentication from "../../helpers/StartAuthentication";
import { AuthContext } from "../../providers/AuthContext";
import { NotificationSideMenuContext } from "../../providers/NotificationSideMenu";
import { QueueContext } from "../../providers/QueueContext";
import { UserSideMenuContext } from "../../providers/UserSideMenu";
import "./../../styles/AppBar.css";

export default () => {
  const { login, setLogin } = useContext(AuthContext);
  const sideMenuContext = useContext(UserSideMenuContext);
  const [isTranslucid, setTranslucid] = useState(false);
  const [open, setOpen] = useState(false);

  document.querySelector("body").onscroll = (ev) => {
    console.log(ev);
    if (document.scrollingElement.scrollTop > 5) {
      setTranslucid(true);
    } else setTranslucid(false);
  };

  document.querySelector("html").onwheel = (ev) => {
    console.log(ev);
    if (document.scrollingElement.scrollTop > 5) {
      setTranslucid(true);
    } else setTranslucid(false);
  };

  const notificationSideMenuContext = useContext(NotificationSideMenuContext);
  const queue = useContext(QueueContext);

  function toggleMobileRow() {
    setOpen(!open);
  }

  return (
    <>
      <div id="appbar" className={isTranslucid ? "translucid" : ""}>
        <Link to="/modding">
          <div className="logo"></div>
        </Link>
        <div className="links-row desktop">
          <Link to="/modding" className="anchor1 page-anchor">
            Queues
          </Link>
          <a
            href="https://discord.gg/fpE4YmtRqz"
            className="anchor1 page-anchor"
          >
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
          {login._id == "-1" ? (
            <button onClick={StartAuthentication}>Log-in</button>
          ) : (
            <>
              <div
                className="notification-button desktop"
                onClick={() => {
                  notificationSideMenuContext.setOpen(
                    !notificationSideMenuContext.open
                  );
                }}
              >
                <>
                  {notificationSideMenuContext.size == 0 ? null : (
                    <div className="label-notification">
                      {notificationSideMenuContext.size}
                    </div>
                  )}
                  <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
                </>
              </div>
              <div
                className="avatar"
                onClick={() => {
                  login._id == "-1"
                    ? StartAuthentication()
                    : sideMenuContext.setOpen(!sideMenuContext.open);
                }}
                style={{
                  backgroundImage: `url(https://a.ppy.sh/${login._id})`,
                }}
              ></div>
              <div
                className="notification-button mobile"
                onClick={() => {
                  notificationSideMenuContext.setOpen(
                    !notificationSideMenuContext.open
                  );
                }}
              >
                <>
                  {notificationSideMenuContext.size == 0 ? null : (
                    <div className="label-notification">
                      {notificationSideMenuContext.size}
                    </div>
                  )}
                  <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
                </>
              </div>
              <div
                className={open ? "chevron mobile up" : "chevron mobile"}
                onClick={toggleMobileRow}
              >
                <FontAwesomeIcon
                  icon={open ? faCircleChevronUp : faCircleChevronDown}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className={open ? "links-row mobile open" : "links-row mobile"}
        data-translucid={isTranslucid}
      >
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
    </>
  );
};
