import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateNewQueue from "../../helpers/CreateNewQueue";
import DestroySession from "../../helpers/DestroySession";
import { AuthContext } from "../../providers/AuthContext";
import { MyRequestPanelContext } from "../../providers/MyRequestsPanelContext";
import { QueueContext } from "../../providers/QueueContext";
import { QueueGroupsSideMenuContext } from "../../providers/QueueGroupsSideMenu";
import { QueuePanelContext } from "../../providers/QueuePanelContext";
import { UserSideMenuContext } from "../../providers/UserSideMenu";
import SideMenu from "./SideMenu";

export default () => {
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
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

  console.log(sideMenuContext.open);

  return (
    <SideMenu
      context={UserSideMenuContext}
      options={[
        { label: "My queue", callback: goToUserQueue },
        {
          label: login.hasQueue ? "Queue settings" : "Create a queue",
          callback: () => {
            login.hasQueue
              ? queuePanelContext.setOpen(true)
              : CreateNewQueue(login);
          },
        },
        {
          label: "My Requests",
          callback: () => {
            requestsPanelContext.setOpen(true);
          },
        },
        {
          label: "My groups",
          callback: () => {
            groupsMenuContext.setOpen(true);
          },
        },
        {
          label: "Log-out",
          callback: () => {
            DestroySession();
          },
        },
      ]}
      title={`Hello, ${login.username}!`}
    ></SideMenu>
  );
};
