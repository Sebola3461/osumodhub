// import { faMusic, faClock } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import * as d3 from "d3";
// import TimeString from "../../helpers/TimeString";
// import { IQueueRequest } from "../../types/queue";
// import CatchIcon from "../icons/CatchIcon";
// import ManiaIcon from "../icons/ManiaIcon";
// import OsuIcon from "../icons/OsuIcon";
// import TaikoIcon from "../icons/TaikoIcon";
// import "./../../styles/GDSelector.css";

// export default ({
//   request,
//   onClick,
// }: {
//   onClick?: any;
//   request: IQueueRequest;
// }) => {
//   const icons = [OsuIcon, TaikoIcon, CatchIcon, ManiaIcon];

//   const difficultyColourSpectrum = d3
//     .scaleLinear<string>()
//     .domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
//     .clamp(true)
//     .range([
//       "#4290FB",
//       "#4FC0FF",
//       "#4FFFD5",
//       "#7CFF4F",
//       "#F6F05C",
//       "#FF8068",
//       "#FF4E6F",
//       "#C645B8",
//       "#6563DE",
//       "#18158E",
//       "#000000",
//     ])
//     .interpolate(d3.interpolateRgb.gamma(2.2));

//   return (
//     <div
//       className="gdselector"
//       onClick={() => {
//         if (onClick) onClick();
//       }}
//     >
//       <div
//         className="bigbanner"
//         style={{
//           backgroundImage: `url(${request.beatmap.covers["cover@2x"]})`,
//         }}
//       ></div>
//       <div className="attributes">
//         <div>
//           <FontAwesomeIcon icon={faMusic} />
//           <p>{request.beatmap.bpm}bpm</p>
//         </div>
//         <div>
//           <FontAwesomeIcon icon={faClock} />
//           <p>
//             {TimeString(
//               request.beatmap.beatmaps ? request.beatmap.duration : 0
//             )}
//           </p>
//         </div>
//       </div>
//       <p className="title">{request.beatmap.title}</p>
//       <p className="artist">{request.beatmap.artist}</p>
//       <p className="host">
//         hosted by <span>{request.beatmap.creator}</span>
//       </p>
//       <div className="difficulties">
//         {request.difficulties.map((d) => {
//           const Icon = icons[d.mode];

//           return (
//             <div className={d.claimed ? "difficulty claimed" : "difficulty"}>
//               <Icon
//                 width="30px"
//                 height="30px"
//                 color={difficultyColourSpectrum(d.starRating)}
//               />
//               <div className="metadata">
//                 <p className="name">{d.name}</p>
//                 {!d.claimed ? (
//                   <></>
//                 ) : (
//                   <p className="mapper">
//                     claimed by <span>{d.user.name}</span>
//                   </p>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

export default () => {
  return <></>;
};
