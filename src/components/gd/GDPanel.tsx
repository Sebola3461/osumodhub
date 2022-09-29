// import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useSnackbar } from "notistack";
// import { useContext, useEffect, useState } from "react";
// import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
// import { AuthContext } from "../../providers/AuthContext";
// import { GDPanelContext } from "../../providers/GDPanelContext";
// import "./../../styles/GDPanel.css";
// import SelectDifficulty from "./gdpanel/SelectDifficulty";

// export default () => {
//   const [tab, setTab] = useState(0);
//   const [beatmaps, setBeatmaps] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const [selectedBeatmap, setSelectedBeatmap] = useState(0);
//   const { login, setLogin } = useContext(AuthContext);

//   const [selectedDifficulty, setSelectedDifficulty] = useState(-1);
//   const [canSubmit, setCanSubmit] = useState(false);
//   const context = useContext(GDPanelContext);
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

//   //   useEffect(() => {
//   //     if (
//   //       post.difficulties.length != 0 &&
//   //       diffs.find((d) => d.id == selectedDifficulty)
//   //     ) {
//   //       setCanSubmit(true);
//   //     } else {
//   //       setCanSubmit(false);
//   //     }

//   //     console.log(canSubmit);
//   //   }, [post]);

//   //   useEffect(() => {
//   //     post.beatmapset_id = selectedBeatmap;

//   //     if (
//   //       post.difficulties.length != 0 &&
//   //       diffs.find((d) => d.id == selectedDifficulty)
//   //     ) {
//   //       setCanSubmit(true);
//   //     } else {
//   //       setCanSubmit(false);
//   //     }
//   //   }, [selectedBeatmap]);

//   //   useEffect(() => {
//   //     if (
//   //       post.difficulties.length != 0 &&
//   //       diffs.find((d) => d.id == selectedDifficulty)
//   //     ) {
//   //       setCanSubmit(true);
//   //     } else {
//   //       setCanSubmit(false);
//   //     }
//   //   }, [selectedDifficulty]);

//   function closePanel() {
//     window.history.replaceState(null, document.title, `/gd`);
//     context.setOpen(false);
//   }

//   useEffect(() => {
//     const beatmap_id = new URLSearchParams(location.search).get("b");

//     if (!context.gd && beatmap_id && context.open) {
//       fetch(`/api/gd/${beatmap_id}`)
//         .then((r) => r.json())
//         .then((d) => {
//           if (d.status != 200)
//             return enqueueSnackbar(d.message, {
//               variant: "error",
//               action,
//             });

//           context.setGD(d.data);
//         });
//     }

//     if (context.open && context.gd) {
//       window.history.replaceState(
//         null,
//         document.title,
//         `/gd?b=${context.gd.beatmapset_id}`
//       );
//     }

//     if (!context.open) {
//       setSelectedDifficulty(-1);
//     }
//   }, [context]);

//   const tabs = [
//     <SelectDifficulty
//       selectedDifficulty={selectedDifficulty}
//       setSelectedDifficulty={setSelectedDifficulty}
//       setTab={setTab}
//     />,
//     // <SelectBeatmap
//     //   beatmaps={beatmaps}
//     //   setTab={setTab}
//     //   selected={selectedBeatmap}
//     //   setSelected={setSelectedBeatmap}
//     //   post={post}
//     //   setPost={setPost}
//     // ></SelectBeatmap>,
//     // <PostBeatmap
//     //   post={post}
//     //   setPost={setPost}
//     //   setTab={setTab}
//     //   selectedDifficulty={selectedDifficulty}
//     //   setSelectedDifficulty={setSelectedDifficulty}
//     //   diffs={diffs}
//     //   setDiffs={setDiffs}
//     //   canSubmit={canSubmit}
//     // />,
//     // <CheckoutTab
//     //   post={post}
//     //   setPost={setPost}
//     //   loading={loading}
//     //   setLoading={setLoading}
//     //   submit={submitPost}
//     // />,
//   ];

//   //   function submitPost() {
//   //     if (post.genres.length == 0) {
//   //       return enqueueSnackbar("Add genres before!", {
//   //         variant: "error",
//   //         action,
//   //       });
//   //     }

//   //     setLoading(true);

//   //     fetch("/api/gd/new", {
//   //       method: "POST",
//   //       headers: {
//   //         authorization: login.account_token,
//   //         "content-type": "application/json",
//   //       },
//   //       body: JSON.stringify(post),
//   //     })
//   //       .then((r) => r.json())
//   //       .then((d) => {
//   //         enqueueSnackbar(d.message, {
//   //           variant: d.status == 200 ? "success" : "error",
//   //           action,
//   //         });

//   //         setLoading(false);
//   //       });
//   //   }

//   return (
//     <>
//       <div className={context.open ? "gdpanel open" : "gdpanel"}>
//         <div className={context.gd ? "container" : "container waiting"}>
//           <div className="paneltitle">
//             Guest Difficulty
//             <FontAwesomeIcon
//               icon={faTimes}
//               color="#fff"
//               onClick={closePanel}
//               style={{
//                 display: "block",
//                 marginLeft: "auto",
//               }}
//             />
//           </div>
//           {tabs[0]}
//         </div>
//       </div>
//     </>
//   );
// };
export default () => {
  return <></>;
};
