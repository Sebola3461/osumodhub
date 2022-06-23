import {
  faEdit,
  faFileArrowUp,
  faFilePen,
  faTrash,
  faUnlock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Markdown from "markdown-to-jsx";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import { AuthContext } from "../../providers/AuthContext";
import { NotificationSideMenuContext } from "../../providers/NotificationSideMenu";
import "./../../styles/SideMenu.css";
// import "./../../styles/NotificationSideMenu.css";
import { useSnackbar } from "notistack";

export default () => {
  const { open, setOpen, pending, setPending, size, setSize } = useContext(
    NotificationSideMenuContext
  );
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState([]);
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const icon = {
    "queue:state": <FontAwesomeIcon icon={faUnlock}></FontAwesomeIcon>,
    "queue:request": <FontAwesomeIcon icon={faFileArrowUp}></FontAwesomeIcon>,
    "request:update": <FontAwesomeIcon icon={faFilePen}></FontAwesomeIcon>,
    "queue:openfollow": <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>,
  };

  useEffect(() => {
    if (login._id == -1) return;

    fetch(`/api/notifications`, {
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        setNotifications(d.data);
        setSize(d.length);
      });

    setInterval(() => {
      fetch(`/api/notifications`, {
        headers: {
          authorization: login.account_token,
        },
      })
        .then((r) => r.json())
        .then((d) => {
          setNotifications(d.data);
          console.log(notifications);
        });
    }, 15000);
  }, []);

  function closePanel(ev) {
    if (!ev.target.className || !ev.target.className.includes("sidemenu"))
      return;

    setOpen(!open);

    return;
  }

  function validateNotification(notification: any, ev: any) {
    fetch(`/api/notifications/${notification._id}`, {
      method: "POST",
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        if (
          ev.target.className &&
          ev.target.className.includes("delete-option")
        )
          return;

        switch (notification.type) {
          case "request:update": {
            goTo(`/queue/${notification.extra.queue_id}#${notification._id}`);

            break;
          }
          case "queue:openfollow": {
            goTo(`/queue/${notification.extra.queue_id}#${notification._id}`);

            break;
          }
          case "queue:request": {
            goTo(`/queue/${login._id}#${notification._id}`);

            break;
          }
          case "queue:state": {
            goTo(`/queue/${login._id}#${notification._id}`);

            break;
          }
        }
      });
  }

  function deleteNotification(notification: any) {
    setLoadingNotifications([loadingNotifications, ...notification._id]);

    fetch(`/api/notifications/${notification._id}`, {
      method: "POST",
      headers: {
        authorization: login.account_token,
      },
    });

    notifications.splice(
      notifications.findIndex((n) => n._id == notification._id),
      1
    );

    setLoadingNotifications(
      loadingNotifications.filter((n) => n != notification._id)
    );

    setNotifications(notifications);
  }

  function clearNotifications() {
    fetch(`/api/notifications/`, {
      method: "DELETE",
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
        });

        if (d.status == 200) {
          setNotifications([]);
        }
      });
  }

  function auxClosePanel(ev: any) {
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
          <p>Notifications</p>
        </div>
        <div onClick={clearNotifications} className="clearnotifications">
          <FontAwesomeIcon icon={faTrash} />
          <p>Clear all notifications</p>
        </div>
        <div className="notifications">
          {notifications.map((notification, i) => {
            return (
              <div
                className={
                  loadingNotifications.includes(notification._id)
                    ? "notification loading"
                    : "notification"
                }
                onClick={(ev) => {
                  validateNotification(notification, ev);
                }}
                key={GenerateComponentKey(20)}
              >
                <div className="horizontal">
                  <div className="icon">{icon[notification.type]}</div>
                  <div className="content">
                    {<Markdown>{notification.content}</Markdown>}
                  </div>
                </div>
                <div
                  className="delete-overlay delete-option"
                  onClick={(ev) => {
                    deleteNotification(notification);
                  }}
                >
                  Mark as read
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
