// import "./../../styles/GDPostSelector.css";
// import { IGDRequest } from "./GDSelector";

// export default ({
//   request,
//   selected,
//   onClick,
// }: {
//   request: IGDRequest;
//   selected?: string;
//   onClick?: (v: string) => any;
// }) => {
//   return (
//     <div
//       className={
//         selected == request._id ? "gdpostselector selected" : "gdpostselector"
//       }
//       style={{
//         backgroundImage: `url(${request.beatmap.covers["cover@2x"]})`,
//       }}
//       onClick={() => {
//         if (onClick) onClick(request._id);
//       }}
//     >
//       <div className="metadata">
//         <p className="title">{request.beatmap.title}</p>
//         <p className="artist">{request.beatmap.artist}</p>
//       </div>
//       <div className={request.pending ? "pending visible" : "pending"}>
//         New requests
//       </div>
//     </div>
//   );
// };

export default () => {
  return <></>;
};
