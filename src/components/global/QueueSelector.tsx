import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import CatchIcon from "../icons/CatchIcon";
import ManiaIcon from "../icons/ManiaIcon";
import OsuIcon from "../icons/OsuIcon";
import TaikoIcon from "../icons/TaikoIcon";
import "./../../styles/QueueSelector.css";
import Tag from "./Tag";
import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
} from "./../../libs/react-contextmenu/es6/";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import { IQueue } from "../../types/queue";

type QueueModes = 0 | 1 | 2 | 3;

export default ({ queue }: { queue: IQueue }) => {
  const icons = [
    <OsuIcon color="white" width="1.2em" height="1.2em"></OsuIcon>,
    <TaikoIcon color="white" width="1.2em" height="1.2em"></TaikoIcon>,
    <CatchIcon color="white" width="1.2em" height="1.2em"></CatchIcon>,
    <ManiaIcon color="white" width="1.2em" height="1.2em"></ManiaIcon>,
  ];

  const typeColors: { [key: string]: string } = {
    modder: "#2196f3",
    group: "#c52d61",
    BN: "#a347eb",
    NAT: "#eb8c47",
  };

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  return (
    <>
      <Link to={`/queue/${queue._id}`} className="queue">
        <div
          className={
            queue.open
              ? "background2 queueselector open"
              : "background2 queueselector closed"
          }
          style={{
            backgroundImage: `url(${queue.banner})`,
          }}
        >
          <div className="leftdata">
            <div
              className="avatar"
              style={{
                backgroundImage: `url(https://a.ppy.sh/${queue._id})`,
              }}
            ></div>
            <Tag
              content={queue.type}
              style={{
                backgroundColor: typeColors[queue.type],
                color: "white",
                fontSize: "13px",
              }}
            ></Tag>
          </div>
          <div className="vertical">
            <div
              className="row center"
              style={{
                marginTop: "10px",
              }}
            >
              {queue.isGroup ? (
                <></>
              ) : (
                <div
                  className="flag"
                  style={{
                    backgroundImage: `url(${queue.country.flag.toLowerCase()})`,
                  }}
                ></div>
              )}
              {queue.modes.map((m, i) => {
                return (
                  <div className="modeicon" key={i}>
                    {icons[m]}
                  </div>
                );
              })}
              <Tag
                content={queue.open ? "open" : "closed"}
                style={{
                  backgroundColor: queue.open ? "var(--green)" : "var(--red)",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              ></Tag>
            </div>
            <p className="name">
              {queue.name}
              {queue.verified ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="verifiedbadge"
                  color="#25ca6a"
                  style={{
                    width: "18px",
                    marginLeft: "5px",
                  }}
                />
              ) : (
                <></>
              )}
            </p>
            <div className="tags">
              {queue.genres.map((g, i) => {
                return <span key={i}>{g}</span>;
              })}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
