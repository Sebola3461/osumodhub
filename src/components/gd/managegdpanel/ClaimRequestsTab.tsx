// import { useEffect } from "react";
// import { GenerateComponentKey } from "../../../helpers/GenerateComponentKey";
// import NoRequests from "../../global/NoRequests";
// import * as d3 from "d3";
// import { IGDRequest } from "../GDSelector";
// import { Icon } from "@mui/material";
// import CatchIcon from "../../icons/CatchIcon";
// import ManiaIcon from "../../icons/ManiaIcon";
// import OsuIcon from "../../icons/OsuIcon";
// import TaikoIcon from "../../icons/TaikoIcon";

// export default ({
//   requests,
//   selectedPost,
//   setSelectedPost,
//   selectedRequest,
//   setSelectedRequest,
//   setTab,
//   claimRequests,
//   setClaimRequests,
//   selectedPostData,
//   selectedDifficulty,
// }: {
//   requests: {
//     pending: IGDRequest[];
//     other: IGDRequest[];
//   };
//   selectedPost: string;
//   selectedDifficulty: string;
//   setSelectedPost: (v: string) => any;
//   selectedRequest: any;
//   setSelectedRequest: (v: string) => any;
//   setTab: (v: number) => any;
//   claimRequests: any;
//   setClaimRequests: any;
//   setSelectedPostData: (d: any) => any;
//   selectedPostData: any;
// }) => {
//   useEffect(() => {
//     fetch(`/api/gd/${selectedPost}/claim`)
//       .then((r) => r.json())
//       .then((d) => {
//         setClaimRequests(d.data);
//       });
//   }, [selectedPost]);

//   useEffect(() => {}, [selectedRequest]);

//   let hasSelectedPost = claimRequests.find((r) => r._id == selectedRequest);

//   const statusText = {
//     waiting: "Pending",
//     accepted: "Accepted",
//     rejected: "Rejected",
//   };

//   const statusColor = {
//     waiting: "--darkorange",
//     accepted: "--green",
//     rejected: "--red",
//   };

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

//   console.log(selectedRequest);

//   const Icon = icons[selectedPostData ? selectedPostData.mode : 0];

//   return (
//     <div className="requestsposttab customscroll">
//       <div className="listcategory">
//         <div className="listing customscroll">
//           {claimRequests.filter((c) => c.difficulty == selectedDifficulty)
//             .length == 0 ? (
//             <NoRequests></NoRequests>
//           ) : (
//             claimRequests
//               .filter((c) => c.difficulty == selectedDifficulty)
//               .map((r) => {
//                 if (!r.difficulty_data) return <></>;

//                 return (
//                   <div
//                     className={
//                       selectedRequest._id == r._id
//                         ? "claimrequest selected"
//                         : "claimrequest"
//                     }
//                     onClick={() => {
//                       setSelectedRequest(r);
//                     }}
//                   >
//                     <div
//                       className="avatar"
//                       style={{
//                         backgroundImage: `url(https://a.ppy.sh/${r._owner})`,
//                       }}
//                     ></div>
//                     <div className="metadata">
//                       <p className="username">{r._owner_name}</p>
//                     </div>
//                     <div
//                       className="status"
//                       style={{
//                         backgroundColor: `var(${statusColor[r.status]})`,
//                       }}
//                     >
//                       {statusText[r.status]}
//                     </div>
//                   </div>
//                 );
//               })
//           )}
//         </div>
//       </div>
//       <div className="vertical">
//         <textarea readOnly value={selectedRequest.comment}></textarea>
//         <div className="row">
//           <button>Reject</button>
//           <button>Accept</button>
//         </div>
//       </div>
//     </div>
//   );
// };
export default () => {
  return <></>;
};
