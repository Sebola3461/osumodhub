import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateNewQueue from "../../helpers/CreateNewQueue";
import DestroySession from "../../helpers/DestroySession";
import { AuthContext } from "../../providers/AuthContext";
import { MyRequestPanelContext } from "../../providers/MyRequestsPanelContext";
import { QueueContext } from "../../providers/QueueContext";
import { QueuePanelContext } from "../../providers/QueuePanelContext";
import { QueueGroupsSideMenuContext } from "../../providers/QueueGroupsSideMenu";
import SideMenu from "./SideMenu";
import "./../../styles/QueueGroupSideMenu.css";
import { CreateGroupPanelContext } from "../../providers/CreateGroupContext";

export default () => {
  const { login, setLogin } = useContext(AuthContext);

  const context = useContext(QueueGroupsSideMenuContext);
  const panel = useContext(CreateGroupPanelContext);
  const [groups, setGroups] = useState<any[] | undefined>();

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  useEffect(() => {
    fetch("/api/users/groups", {
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status != 200) return;

        setGroups(d.data);
      });
  }, []);

  function startNewGroupProcess() {
    panel.setOpen(true);
  }

  function groupSelector(g: any) {
    return (
      <div
        className="queue"
        onClick={() => {
          goTo(`/queue/${g._id}`);
        }}
      >
        <div
          className="image"
          style={{
            backgroundImage: `url(${g.icon})`,
          }}
        ></div>
        <p className="qtitle">{g.name}</p>
      </div>
    );
  }

  return (
    <SideMenu
      context={QueueGroupsSideMenuContext}
      options={[{ label: "Create new group", callback: startNewGroupProcess }]}
      title={`Queue Groups`}
      customComponents={
        !groups ? [<></>] : groups.map((g) => groupSelector(g)) || []
      }
    ></SideMenu>
  );
};
