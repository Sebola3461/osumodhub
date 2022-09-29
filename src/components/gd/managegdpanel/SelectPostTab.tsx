// import NoRequests from "../../global/NoRequests";
// import GDPostSelector from "../GDPostSelector";
// import { IGDRequest } from "../GDSelector";

// export default ({
//   requests,
//   selectedPost,
//   setSelectedPost,
//   setTab,
//   setSelectedPostData,
// }: {
//   requests: {
//     pending: IGDRequest[];
//     other: IGDRequest[];
//   };
//   selectedPost: string;
//   setSelectedPost: (v: string) => any;
//   setTab: (v: number) => any;
//   setSelectedPostData: (d: any) => any;
// }) => {
//   return (
//     <div className="selectposttab customscroll">
//       <div className="listcategory">
//         <p className="category_title">New Updates</p>
//         <div className="listing">
//           {requests.pending.length == 0 ? (
//             <NoRequests />
//           ) : (
//             requests.pending.map((r) => {
//               return (
//                 <GDPostSelector
//                   request={r}
//                   selected={selectedPost}
//                   onClick={(id) => {
//                     setSelectedPost(id);
//                     setSelectedPostData(r);
//                     setTab(1);
//                   }}
//                 />
//               );
//             })
//           )}
//         </div>
//       </div>
//       <div className="listcategory">
//         <p className="category_title">All</p>
//         <div className="listing">
//           {requests.other.length == 0 ? (
//             <NoRequests />
//           ) : (
//             requests.other.map((r) => {
//               return (
//                 <GDPostSelector
//                   request={r}
//                   selected={selectedPost}
//                   onClick={(id) => {
//                     setSelectedPost(id);
//                     setSelectedPostData(r);
//                     setTab(1);
//                   }}
//                 />
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
export default () => {
  return <></>;
};
