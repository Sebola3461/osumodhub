import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import { AuthContext } from "../../providers/AuthContext";
import { ManageGDPanelContext } from "../../providers/ManageGDPanelContext";
import "./../../styles/ManageGDPanel.css";
import GDPostSelector from "./GDPostSelector";
import ClaimRequestsTab from "./managegdpanel/ClaimRequestsTab";
import PostDifficultiesTab from "./managegdpanel/PostDifficultiesTab";
import SelectPostTab from "./managegdpanel/SelectPostTab";

export default () => {
  const context = useContext(ManageGDPanelContext);
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const [tab, setTab] = useState(0);
  const [selectedPost, setSelectedPost] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedRequest, setSelectedRequest] = useState({});
  const [claimRequests, setClaimRequests] = useState([]);
  const [selectedPostData, setSelectedPostData] = useState();
  const [requests, setRequests] = useState({
    pending: [],
    other: [],
  });

  function closePanel() {
    context.setOpen(false);
  }

  useEffect(() => {
    window.addEventListener("keydown", (ev) => {
      if (ev.key == "Escape") closePanel();
    });

    fetch(`/api/users/${login._id}/posts`, {
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        setRequests(d.data);
      });
  }, []);

  function selectPost(v: string) {
    setSelectedRequest(selectedRequest);
    setSelectedPost(v);
  }

  const tabs = [
    <SelectPostTab
      requests={requests}
      selectedPost={selectedPost}
      setSelectedPost={setSelectedPost}
      setTab={setTab}
      setSelectedPostData={setSelectedPostData}
    ></SelectPostTab>,
    <PostDifficultiesTab
      requests={requests}
      selectedPost={selectedPost}
      setSelectedPost={selectPost}
      selectedRequest={selectedRequest}
      setSelectedRequest={setSelectedRequest}
      setTab={setTab}
      claimRequests={claimRequests}
      setClaimRequests={setClaimRequests}
      setSelectedPostData={setSelectedPostData}
      selectedPostData={selectedPostData}
      setSelectedDifficulty={setSelectedDifficulty}
      selectedDifficulty={setSelectedDifficulty}
    ></PostDifficultiesTab>,
    <ClaimRequestsTab
      requests={requests}
      selectedPost={selectedPost}
      setSelectedPost={selectPost}
      selectedRequest={selectedRequest}
      setSelectedRequest={setSelectedRequest}
      setTab={setTab}
      claimRequests={claimRequests}
      setClaimRequests={setClaimRequests}
      setSelectedPostData={setSelectedPostData}
      selectedPostData={selectedPostData}
      selectedDifficulty={selectedDifficulty}
    ></ClaimRequestsTab>,
  ];

  return (
    <>
      <div className={context.open ? "managegdpanel open" : "managegdpanel"}>
        <div className={"container"}>
          <div className="paneltitle">
            Post Requests
            <FontAwesomeIcon
              icon={faTimes}
              onClick={closePanel}
              color="#fff"
              style={{
                display: "block",
                marginLeft: "auto",
              }}
            />
          </div>
          <div className="tab" key={GenerateComponentKey(20)}>
            <div
              className={tab == 0 ? "option selected" : "option"}
              onClick={() => {
                setTab(0);
              }}
            >
              Select Post
            </div>
            <div
              className={tab == 1 ? "option selected" : "option"}
              onClick={() => {
                if (!selectedPostData) return;
                setTab(1);
              }}
            >
              Select Difficulty
            </div>
            <div
              className={tab == 2 ? "option selected" : "option"}
              onClick={() => {
                if (!selectedDifficulty) return;

                setTab(2);
              }}
            >
              Claim Requests
            </div>
          </div>
          {tabs[tab]}
        </div>
      </div>
    </>
  );
};
