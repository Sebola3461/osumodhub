// import { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../../../providers/AuthContext";
// import BeatmapSelector from "../../global/BeatmapSelector";
// import TagsInput from "../../global/TagsInput";
// import GDSelector from "../GDSelector";

// export default ({
//   post,
//   setPost,
//   loading,
//   setLoading,
//   submit,
// }: {
//   post: any;
//   setPost: any;
//   loading: boolean;
//   setLoading: any;
//   submit: any;
// }) => {
//   return (
//     <div className={loading ? "checkouttab loading" : "checkouttab"}>
//       <GDSelector request={post}></GDSelector>
//       <div className="actions">
//         <textarea
//           className="comment"
//           placeholder="Type about your beatmap"
//         ></textarea>
//         <div className="__container">
//           <p className="__container-title">Genres</p>
//           <TagsInput
//             value={post.genres}
//             onInput={(genres) => {
//               post.genres = genres;

//               setPost(post);
//             }}
//           ></TagsInput>
//         </div>
//         <div className="__container">
//           <p className="__container-title">Tags</p>
//           <TagsInput
//             value={post.tags}
//             onInput={(tags) => {
//               post.tags = tags;

//               setPost(post);
//             }}
//           ></TagsInput>
//         </div>
//         <button className="submit" onClick={submit}>
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };
export default () => {
  return <></>;
};
