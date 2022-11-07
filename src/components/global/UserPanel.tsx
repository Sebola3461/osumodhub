import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateNewQueue from "../../helpers/CreateNewQueue";
import DestroySession from "../../helpers/DestroySession";
import { getLocalization } from "../../localization/localizationManager";
import { AuthContext } from "../../providers/AuthContext";
import { MyRequestPanelContext } from "../../providers/MyRequestsPanelContext";
import { QueueContext } from "../../providers/QueueContext";
import { QueueGroupsSideMenuContext } from "../../providers/QueueGroupsSideMenu";
import { QueuePanelContext } from "../../providers/QueuePanelContext";
import { UserSideMenuContext } from "../../providers/UserSideMenu";
import { LanguageSelector } from "./LanguageSelector";
import SideMenu from "./SideMenu";

export default () => {
  const { login, setLogin } = useContext(AuthContext);

  const sideMenuContext = useContext(UserSideMenuContext);
  const groupsMenuContext = useContext(QueueGroupsSideMenuContext);
  const queuePanelContext = useContext(QueuePanelContext);
  const requestsPanelContext = useContext(MyRequestPanelContext);

  const queue = useContext(QueueContext);

  function refreshQueue() {
    const QueueID = login._id;

    console.log("Refreshing queue data by panel");

    fetch(`/api/queues/${QueueID}`)
      .then((r) => r.json())
      .then((data) => {
        queue.setData(data.data);
        document.title = `${data.data.name} | osu!modhub`;
      });

    refreshRequests();
    refreshFollowers();

    function refreshRequests() {
      console.log("Refreshing queue requests");

      fetch(`/api/queues/${QueueID}/requests`)
        .then((r) => r.json())
        .then((data) => {
          queue.setRequests(data.data);
        });
    }

    function refreshFollowers() {
      console.log("Updating followers data");

      // ? We need to provide account token to check if the user is following the queue
      fetch(`/api/queues/${QueueID}/follow`, {
        headers: {
          authorization: login.account_token,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          queue.setFollowers(data.data.size);
          queue.setFollowing(data.data.mutual);
        });
    }
  }

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  function goToUserQueue() {
    goTo(`/queue/${login._id}`);
    refreshQueue();
  }

  function createQueue() {
    fetch("/api/queues/new", {
      method: "post",
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status == 200) {
          const loginData = JSON.parse(localStorage["user_login"]);
          loginData.hasQueue = true;
          localStorage["user_login"] = JSON.stringify(loginData);

          setLogin(loginData);

          window.location.pathname = `/queue/${login._id}`;
        }
      });
  }

  return (
    <SideMenu
      context={UserSideMenuContext}
      customComponents={[<LanguageSelector />]}
      options={[
        {
          label: getLocalization(login.language, [
            "userSideMenu",
            "options",
            "personalQueue",
          ]),
          callback: goToUserQueue,
        },
        {
          label: getLocalization(login.language, [
            "userSideMenu",
            "options",
            "requests",
          ]),
          callback: () => {
            requestsPanelContext.setOpen(true);
          },
        },
        {
          label: getLocalization(login.language, [
            "userSideMenu",
            "options",
            "groups",
          ]),
          callback: () => {
            groupsMenuContext.setOpen(true);
          },
        },
        {
          label: login.hasQueue
            ? getLocalization(login.language, [
                "userSideMenu",
                "options",
                "settings",
              ])
            : getLocalization(login.language, [
                "userSideMenu",
                "options",
                "createQueue",
              ]),
          callback: () => {
            login.hasQueue ? queuePanelContext.setOpen(true) : createQueue();
          },
        },
        {
          label: getLocalization(login.language, [
            "userSideMenu",
            "options",
            "logout",
          ]),
          callback: () => {
            DestroySession();
          },
        },
      ]}
      title={getLocalization(login.language, ["userSideMenu", "title"]).replace(
        /\$username/,
        login.username
      )}
    ></SideMenu>
  );
};
