// import { Beatmapset } from "../../../types/beatmap";
// import BeatmapSelector from "../../global/BeatmapSelector";
// import TagsInput from "../../global/TagsInput";
// import "./../../../styles/PostBeatmapTab.css";
// import * as d3 from "d3";
// import CatchIcon from "../../icons/CatchIcon";
// import ManiaIcon from "../../icons/ManiaIcon";
// import OsuIcon from "../../icons/OsuIcon";
// import TaikoIcon from "../../icons/TaikoIcon";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useEffect, useState } from "react";
// import SearchSelect from "../../global/SearchSelect";
// import { GenerateComponentKey } from "../../../helpers/GenerateComponentKey";
// import NoRequests from "../../global/NoRequests";

// export default ({
//   post,
//   setPost,
//   setTab,
//   selectedDifficulty,
//   setSelectedDifficulty,
//   setDiffs,
//   diffs,
//   canSubmit,
// }: {
//   canSubmit: boolean;
//   setTab: any;
//   setDiffs: any;
//   diffs: any;
//   selectedDifficulty: number;
//   setSelectedDifficulty: any;
//   post: {
//     comment: string;
//     beatmapset_id: number;
//     difficulties: {
//       min_sr: number;
//       max_sr: number;
//       mode: number;
//       name: string;
//       user: number | null;
//       updated_at: Date;
//     }[];
//     beatmap: any;
//     genres: string[];
//     tags: string[];
//     modes: number[];
//   };
//   setPost: any;
// }) => {
//   const [_static, setStatic] = useState({
//     min_sr: 1,
//     max_sr: 5,
//     mode: 0,
//     name: "New Difficulty",
//     user: null,
//     updated_at: new Date(),
//     id: undefined,
//   });

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

//   function addStatic() {
//     // const d = post.difficulties;
//     // d.push(_static);

//     // post.difficulties = d;

//     // * For some reason this shit modify the entire array instead add a element, so i need to make it a string then make it a object again
//     _static.id = GenerateComponentKey(20);
//     setStatic(_static);

//     const d = [JSON.stringify(_static)];

//     post.difficulties.forEach((diff) => {
//       d.push(JSON.stringify(diff));
//     });

//     const _d = [];

//     d.forEach((diff) => {
//       _d.push(JSON.parse(diff));
//     });

//     post.difficulties = JSON.parse(JSON.stringify(_d));

//     // post.difficulties.push(_static);

//     setPost(JSON.parse(JSON.stringify(post)));
//     setDiffs(_d);
//   }

//   function saveSelectedDiff() {
//     const validKeys = ["min_sr", "max_sr", "mode", "name", "updated_at"];

//     const index = diffs.findIndex((d) => d.id == selectedDifficulty);

//     const d = diffs[index];

//     validKeys.forEach((key) => {
//       d[key] = _static[key];
//     });

//     setDiffs(JSON.parse(JSON.stringify(diffs)));

//     post.difficulties = JSON.parse(JSON.stringify(diffs));

//     // post.difficulties.push(_static);

//     setPost(JSON.parse(JSON.stringify(post)));
//   }

//   useEffect(() => {
//     const validKeys = ["min_sr", "max_sr", "mode", "name", "updated_at"];

//     const index = diffs.findIndex((d) => d.id == selectedDifficulty);

//     const d = diffs[index];

//     if (d) {
//       validKeys.forEach((key) => {
//         _static[key] = d[key];
//       });
//     }

//     setStatic(JSON.parse(JSON.stringify(_static)));
//   }, [selectedDifficulty]);

//   function deleteDiff(id: string) {
//     if (confirm("Are you sure?")) {
//       diffs = diffs.filter((d) => d.id != id);

//       setDiffs(JSON.parse(JSON.stringify(diffs)));

//       post.difficulties = diffs;
//       setPost(JSON.parse(JSON.stringify(post)));

//       setSelectedDifficulty("");
//     }
//   }

//   function getStaticBeatmap() {
//     const Icon =
//       icons[
//         post.difficulties[diffs.findIndex((d) => d.id == selectedDifficulty)]
//           ? post.difficulties[
//               diffs.findIndex((d) => d.id == selectedDifficulty)
//             ].mode
//           : 0
//       ];

//     return (
//       <div className="difficultyselector static" key={GenerateComponentKey(20)}>
//         <Icon
//           width="30px"
//           height="30px"
//           color={difficultyColourSpectrum(_static.max_sr)}
//         />
//         <div className="metadata">
//           <p className="name">{_static.name}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="postbeatmaptab">
//       <div
//         className={canSubmit ? "left" : "left disabled"}
//         key={GenerateComponentKey(20)}
//       >
//         <BeatmapSelector
//           beatmapset={post.beatmap}
//           selected={-2}
//           onClick={() => {
//             setTab(0);
//           }}
//         />
//         {getStaticBeatmap()}
//         <div className="option" key={GenerateComponentKey(10)}>
//           <p className="label">Min Stars:</p>
//           <input
//             type="number"
//             min={0.1}
//             max={25}
//             defaultValue={_static.min_sr}
//             onInput={(ev: any) => {
//               _static.min_sr = Number(ev.target.value);
//               setStatic(_static);
//             }}
//             className="input"
//           />
//         </div>
//         <div className="option">
//           <p className="label">Max Stars:</p>
//           <input
//             type="number"
//             min={0.1}
//             max={25}
//             defaultValue={_static.max_sr}
//             onInput={(ev: any) => {
//               _static.max_sr = Number(ev.target.value);
//               setStatic(_static);
//             }}
//             key={GenerateComponentKey(10)}
//             className="input"
//           />
//         </div>
//         <div className="option">
//           <p className="label">Difficulty Name:</p>
//           <input
//             type="text"
//             placeholder="Type somthing"
//             className="input"
//             key={GenerateComponentKey(10)}
//             defaultValue={_static.name}
//             onInput={(ev: any) => {
//               _static.name = ev.target.value;
//               setStatic(_static);
//             }}
//           />
//         </div>
//         <div className="option">
//           <p className="label">Game Mode:</p>
//           <select
//             onInput={(ev: any) => {
//               _static.mode = Number(ev.target.value);
//               setStatic(_static);
//             }}
//             key={GenerateComponentKey(10)}
//             defaultValue={String(_static.mode)}
//             className="input"
//           >
//             <option value="0">osu!</option>
//             <option value="1">osu!taiko</option>
//             <option value="2">osu!catch</option>
//             <option value="3">osu!mania</option>
//           </select>
//         </div>
//         <button className="savediff" onClick={saveSelectedDiff}>
//           Save
//         </button>
//       </div>
//       <div className="right" key={GenerateComponentKey(10)}>
//         <button
//           className="addbutton"
//           onClick={() => {
//             addStatic();
//           }}
//         >
//           <FontAwesomeIcon icon={faPlus} /> Add
//         </button>
//         {diffs.length == 0 ? (
//           <NoRequests text="Add a new difficulty to start!" />
//         ) : (
//           diffs.map((d, i) => {
//             const Icon = icons[d.mode];

//             return (
//               <div
//                 className={
//                   selectedDifficulty == d.id
//                     ? "difficultyselector selected"
//                     : "difficultyselector"
//                 }
//                 onClick={() => {
//                   setSelectedDifficulty(d.id);
//                 }}
//               >
//                 <Icon
//                   width="30px"
//                   height="30px"
//                   color={difficultyColourSpectrum(d.max_sr)}
//                 />
//                 <div className="metadata">
//                   <p className="name">{d.name}</p>
//                   <div
//                     className="deletebutton"
//                     onClick={() => {
//                       deleteDiff(d.id);
//                     }}
//                   >
//                     <FontAwesomeIcon icon={faTrash} />
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };
export default () => {
  return <></>;
};
