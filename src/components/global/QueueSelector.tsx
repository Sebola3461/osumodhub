import { faCalendar, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
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
import { getLocalization } from "../../localization/localizationManager";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthContext";
import moment from "moment";
import { RelativeDay } from "../../helpers/RelativeDay";

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

  const { login } = useContext(AuthContext);

  function getLastSeenColor(date: Date) {
    if (RelativeDay(date, new Date()) <= 7) return "#25ca6a";

    if (
      RelativeDay(date, new Date()) > 7 &&
      RelativeDay(date, new Date()) <= 14
    )
      return "#ff9822";

    return "#c52d2d";
  }

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
                backgroundImage: `url(${queue.icon})`,
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
              {queue.type == "group" ? (
                <></>
              ) : (
                <div
                  className="flag"
                  style={{
                    backgroundImage: `url(${
                      queue.country.flag.toLowerCase() ||
                      "https://raw.githubusercontent.com/ppy/osu-web/master/public/images/flags/fallback.png"
                    })`,
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
                content={
                  queue.open
                    ? getLocalization(login.language, [
                        "queues",
                        "status",
                        "open",
                      ])
                    : getLocalization(login.language, [
                        "queues",
                        "status",
                        "closed",
                      ])
                }
                style={{
                  backgroundColor: queue.open ? "var(--green)" : "var(--red)",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              ></Tag>
              <div
                className="last-seen-container"
                aria-label={`Last seen ${moment(
                  new Date(queue.lastSeen)
                ).fromNow()}`}
                data-balloon-pos="up"
              >
                <FontAwesomeIcon
                  icon={faCalendar}
                  color={getLastSeenColor(new Date(queue.lastSeen))}
                />
              </div>
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
