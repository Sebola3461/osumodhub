// import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useSnackbar } from "notistack";
// import { useContext, useEffect, useState } from "react";
// import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
// import { AuthContext } from "../../providers/AuthContext";
// import { PostGDPanelContext } from "../../providers/PostGDPanelContext";
// import "./../../styles/PostGDPanel.css";
// import CheckoutTab from "./postpanel/CheckoutTab";
// import PostBeatmap from "./postpanel/PostBeatmap";
// import SelectBeatmap from "./postpanel/SelectBeatmap";

// export default () => {
//   const [tab, setTab] = useState(0);
//   const [beatmaps, setBeatmaps] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const [selectedBeatmap, setSelectedBeatmap] = useState(0);
//   const { login, setLogin } = useContext(AuthContext);

//   const [selectedDifficulty, setSelectedDifficulty] = useState(0);
//   const [diffs, setDiffs] = useState([]);
//   const [post, setPost] = useState({
//     comment: "",
//     beatmapset_id: -1,
//     difficulties: [],
//     genres: [],
//     tags: [],
//     modes: [],
//     beatmap: {},
//   });
//   const [canSubmit, setCanSubmit] = useState(false);
//   const context = useContext(PostGDPanelContext);
//   const { enqueueSnackbar, closeSnackbar } = useSnackbar();
//   const [loading, setLoading] = useState(false);

//   const action = (key) => (
//     <>
//       <button
//         onClick={() => {
//           closeSnackbar(key);
//         }}
//       >
//         X
//       </button>
//     </>
//   );

//   useEffect(() => {
//     if (
//       post.difficulties.length != 0 &&
//       diffs.find((d) => d.id == selectedDifficulty)
//     ) {
//       setCanSubmit(true);
//     } else {
//       setCanSubmit(false);
//     }

//     console.log(canSubmit);
//   }, [post]);

//   useEffect(() => {
//     post.beatmapset_id = selectedBeatmap;

//     if (
//       post.difficulties.length != 0 &&
//       diffs.find((d) => d.id == selectedDifficulty)
//     ) {
//       setCanSubmit(true);
//     } else {
//       setCanSubmit(false);
//     }
//   }, [selectedBeatmap]);

//   useEffect(() => {
//     if (
//       post.difficulties.length != 0 &&
//       diffs.find((d) => d.id == selectedDifficulty)
//     ) {
//       setCanSubmit(true);
//     } else {
//       setCanSubmit(false);
//     }
//   }, [selectedDifficulty]);

//   useEffect(() => {
//     fetch(`/api/users/${login._id}/beatmaps/?graveyard=true&wip=true`, {
//       headers: {
//         authorization: login.account_token,
//       },
//     })
//       .then((r) => r.json())
//       .then((d) => {
//         //   setLoading(false);
//         //   if (d.status != 200)
//         //     return enqueueSnackbar(d.message, {
//         //       variant: "error",
//         //       action,
//         //     });

//         //   userBeatmaps.unshift(d.data);
//         //   setUserBeatmaps(userBeatmaps);
//         //   setSelected(d.data.id);
//         //   request.beatmap = d.data;
//         //   setRequest(request);
//         //   setTab(1);

//         setBeatmaps(d.data);
//       });
//   }, []);

//   const tabs = [
//     <SelectBeatmap
//       beatmaps={beatmaps}
//       setTab={setTab}
//       selected={selectedBeatmap}
//       setSelected={setSelectedBeatmap}
//       post={post}
//       setPost={setPost}
//     ></SelectBeatmap>,
//     <PostBeatmap
//       post={post}
//       setPost={setPost}
//       setTab={setTab}
//       selectedDifficulty={selectedDifficulty}
//       setSelectedDifficulty={setSelectedDifficulty}
//       diffs={diffs}
//       setDiffs={setDiffs}
//       canSubmit={canSubmit}
//     />,
//     <CheckoutTab
//       post={post}
//       setPost={setPost}
//       loading={loading}
//       setLoading={setLoading}
//       submit={submitPost}
//     />,
//   ];

//   function getSubmitButton() {
//     if (!canSubmit) return <></>;

//     return (
//       <div
//         className={tab == 2 ? "option selected" : "option"}
//         onClick={() => {
//           setTab(2);
//         }}
//       >
//         Checkout
//       </div>
//     );
//   }

//   function submitPost() {
//     if (post.genres.length == 0) {
//       return enqueueSnackbar("Add genres before!", {
//         variant: "error",
//         action,
//       });
//     }

//     setLoading(true);

//     fetch("/api/gd/new", {
//       method: "POST",
//       headers: {
//         authorization: login.account_token,
//         "content-type": "application/json",
//       },
//       body: JSON.stringify(post),
//     })
//       .then((r) => r.json())
//       .then((d) => {
//         enqueueSnackbar(d.message, {
//           variant: d.status == 200 ? "success" : "error",
//           action,
//         });

//         setLoading(false);
//       });
//   }

//   return (
//     <>
//       <div className={context.open ? "postgdpanel open" : "postgdpanel"}>
//         <div className={"container"}>
//           <div className="paneltitle">
//             New post
//             <FontAwesomeIcon
//               icon={faTimes}
//               color="#fff"
//               onClick={() => {
//                 context.setOpen(false);
//               }}
//               style={{
//                 display: "block",
//                 marginLeft: "auto",
//               }}
//             />
//           </div>
//           <div className="tab" key={GenerateComponentKey(20)}>
//             <div
//               className={tab == 0 ? "option selected" : "option"}
//               onClick={() => {
//                 setTab(0);
//               }}
//             >
//               Select Beatmap
//             </div>
//             <div
//               className={tab == 1 ? "option selected" : "option"}
//               onClick={() => {
//                 if (JSON.stringify(post.beatmap) != "{}") setTab(1);
//               }}
//             >
//               Difficulties
//             </div>
//             {getSubmitButton()}
//           </div>
//           {tabs[tab]}
//         </div>
//       </div>
//     </>
//   );
// };
export default () => {
  return <></>;
};
