import { useContext, useEffect, useState } from "react";
import { QueueContext } from "../../providers/QueueContext";
import LoadingComponent from "../global/LoadingComponent";
import Tag from "../global/Tag";
import "./../../styles/GroupMembers.css";

export default () => {
  const [members, setMembers] = useState<any | undefined>();
  const QueueID = location.pathname.split("/").pop().trim();
  const queue = useContext(QueueContext);

  useEffect(() => {
    fetch(`/api/queues/${QueueID}/members`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status != 200) return setMembers([]);
        setMembers(d.data);
      });
  }, []);

  function listMembers() {
    if (!members) return <LoadingComponent text="Loading members..." />;

    return members.map((m, i) => {
      return (
        <div
          className="usercontainer "
          style={{
            animationDelay: `${100 * (i + 1)}ms`,
          }}
          onClick={() => {
            open(`https://osu.ppy.sh/users/${m._id}`);
          }}
        >
          <div
            className="profilepic"
            style={{
              backgroundImage: `url(https://a.ppy.sh/${m._id})`,
            }}
          ></div>
          <p className="name">{m.username}</p>
          <Tag
            content={m._id == queue.data.owner ? "owner" : "manager"}
            type={m._id == queue.data.owner ? "rechecking" : "modder"}
          />
        </div>
      );
    });
  }

  return <div className="groupmembers customscroll">{listMembers()}</div>;
};
