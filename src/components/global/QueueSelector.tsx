import { useNavigate } from "react-router-dom";
import CatchIcon from "../icons/CatchIcon";
import ManiaIcon from "../icons/ManiaIcon";
import OsuIcon from "../icons/OsuIcon";
import TaikoIcon from "../icons/TaikoIcon";
import "./../../styles/QueueSelector.css";
import Tag from "./Tag";

type QueueModes = 0 | 1 | 2 | 3;

interface IQueue {
  _id: number;
  banner: string;
  name: string;
  icon: string;
  open: boolean;
  modes: QueueModes[];
  description: string;
  type: string;
  country: {
    acronym: string;
    name: string;
    flag: string;
  };
  allow: {
    graveyard: boolean;
    wip: boolean;
  };
  genres: string[];
}

export default ({ queue }: { queue: IQueue }) => {
  const icons = [
    <OsuIcon color="white"></OsuIcon>,
    <TaikoIcon color="white"></TaikoIcon>,
    <CatchIcon color="white"></CatchIcon>,
    <ManiaIcon color="white"></ManiaIcon>,
  ];

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  return (
    <div
      className={
        queue.open
          ? "background2 queueselector open"
          : "background2 queueselector closed"
      }
      style={{
        backgroundImage: `url(${queue.banner})`,
      }}
      onClick={() => {
        goTo(`/queue/${queue._id}`);
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
            backgroundColor: "var(--ocean)",
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
          <div
            className="flag"
            style={{
              backgroundImage: `url(${queue.country.flag})`,
            }}
          ></div>
          {queue.modes.map((m, i) => {
            return <div className="modeicon">{icons[m]}</div>;
          })}
        </div>
        <p className="name">{queue.name}</p>
        <div className="tags">
          {queue.genres.map((g, i) => {
            return <span>{g}</span>;
          })}
        </div>
      </div>
    </div>
  );
};
