import { faMessage, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { ManageRequestPanelContext } from "../../providers/ManageRequestPanelContext";
import "./../../styles/ManageRequestPanel.css";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import { useSnackbar } from "notistack";
import { ConfirmDialogContext } from "../../providers/ConfirmDialogContext";
import { QueueContext } from "../../providers/QueueContext";
import SpreadViewer from "../global/SpreadViewer";
import BeatmapsetBanner from "../panels/BeatmapsetBanner";
import Tag from "../global/Tag";
import QueueColors from "../../constants/QueueColors";
import Select from "react-select";
import { queue } from "sharp";

export default () => {
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const [loading, setLoading] = useState(false);
  const { open, request, setOpen, setRequest } = useContext(
    ManageRequestPanelContext
  );
  const dialog = useContext(ConfirmDialogContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const queueContext = useContext(QueueContext);
  const [tab, setTab] = useState(0);

  // ? This will display permalink content
  useEffect(() => {
    const _targetRequest = new URLSearchParams(location.search).get("r");
    if (_targetRequest) displayLinkedRequest();

    function displayLinkedRequest() {
      fetch(`/api/requests/${_targetRequest}`)
        .then((r) => r.json())
        .then((data) => {
          setRequest(data.data);
          setOpen(true);
        });
    }
  }, []);
  // ? ========================================

  if (!queueContext.data || !queueContext.requests) return <></>;

  const action = (key) => (
    <>
      <button
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        X
      </button>
    </>
  );

  function auxClosePanel(ev: any) {
    if (ev.target.className != "managerequestpanel open") return;

    close();

    return;
  }

  function escClosePanel(ev: any) {
    if (ev.target.className != "managerequestpanel open") return;
    if (ev.key != "escape") return;

    close();

    return;
  }

  function updateRequestReply(reply: string) {
    request.reply = reply;
    setRequest(request);
  }

  function updateRequestStatus(status: string) {
    if (status == "delete") return deleteRequest();
    setLoading(true);

    fetch(`/api/requests/${request._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: login.account_token,
      },
      body: JSON.stringify({
        status: status,
        reply: request.reply,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        setLoading(false);
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
          action,
        });

        if (d.status == 200) {
          request.status = status;
          setRequest(request);

          const index = queueContext.requests.findIndex(
            (r) => r._id == request._id
          );
          queueContext.requests[index]["status"] = status;
          queueContext.requests[index]["reply"] = request.reply;
          queueContext.setRequests(queueContext.requests);
        }
      });

    function deleteRequest() {
      dialog.setAction(() => {
        _action();
      });
      dialog.setConfirm();
      dialog.setData({
        title: "Are you sure?",
        text: "This action is **IRREVERSIBLE**!",
      });
      dialog.setOpen(true);

      function _action() {
        setLoading(true);
        fetch(`/api/requests/${request._id}`, {
          method: "delete",
          headers: {
            authorization: login.account_token,
          },
        })
          .then((r) => r.json())
          .then((d) => {
            setLoading(false);
            enqueueSnackbar(d.message, {
              variant: d.status == 200 ? "success" : "error",
              action,
            });

            if (d.status == 200) {
              setOpen(false);
              queueContext.setRequests(
                queueContext.requests.filter((r) => r._id != request._id)
              );
            }
          });
      }
    }
  }

  const modder_options = [
    { label: "Accept", value: "accepted", decoration: "accept" },
    { label: "Reject", value: "rejected", decoration: "reject" },
    { label: "Modded", value: "finished", decoration: "finish" },
    { label: "Archive", value: "archived", decoration: "archive" },
    { label: "Delete", value: "delete", decoration: "accepted" },
  ];

  const bn_options = [
    { label: "Accept", value: "accepted", decoration: "accept" },
    { label: "Reject", value: "rejected", decoration: "reject" },
    { label: "Nominated", value: "nominated", decoration: "nominate" },
    { label: "Ranked", value: "ranked", decoration: "rank" },
    { label: "Waiting another BN", value: "waiting", decoration: "wait" },
    { label: "Need recheck", value: "rechecking", decoration: "recheck" },
    { label: "Archive", value: "archived", decoration: "archive" },
    { label: "Delete", value: "delete", decoration: "delete" },
  ];

  function close() {
    const _targetRequest = new URLSearchParams(location.search).get("r");

    if (_targetRequest) {
      history.pushState(null, "", window.location.pathname);
    }

    setOpen(false);
  }

  if (!request) return <></>;

  const tabs = [
    <div className="contentlayout customscroll">
      <div className="discussion_layout customscroll">
        <div className="mappercomment comment">
          <div className="metadata">
            <div
              className="userpfp"
              style={{
                backgroundImage: `url(https://a.ppy.sh/${request._owner})`,
              }}
            ></div>
            <p className="username">
              {request._owner_name}
              <Tag content="Requester" />
            </p>
          </div>
          <div className="content">
            {request.comment || "No comment provided..."}
          </div>
        </div>
        {!request._managed_by ? (
          <></>
        ) : (
          <div className="modderreply comment">
            <div className="metadata">
              <div
                className="userpfp"
                style={{
                  backgroundImage: `url(https://a.ppy.sh/${request._managed_by})`,
                }}
              ></div>
              <p className="username">
                {request._manager_username}
                <Tag
                  content={
                    queueContext.data.isGroup
                      ? "contributor"
                      : queueContext.data.type
                  }
                  type={
                    queueContext.data.isGroup
                      ? "modder"
                      : queueContext.data.type
                  }
                />
              </p>
            </div>
            <div className="content">
              {request.reply || "No feedback provided..."}
            </div>
          </div>
        )}
      </div>
    </div>,
    <div className="actionslayout customscroll">
      <div className="replycontainer">
        <p>
          <FontAwesomeIcon icon={faMessage} />
          Feedback
        </p>
        <textarea
          className="request-reply"
          defaultValue={request.reply}
          placeholder="optional..."
          onInput={(ev: any) => {
            updateRequestReply(ev.target.value);
          }}
        ></textarea>
      </div>
      <div className="buttons">
        {login.isBn
          ? bn_options.map((o) => (
              <div
                className={`option ${o.decoration}-hover`}
                onClick={() => {
                  updateRequestStatus(o.value);
                }}
              >
                {o.label}
              </div>
            ))
          : modder_options.map((o) => (
              <div
                className={`option ${o.decoration}-hover`}
                onClick={() => {
                  updateRequestStatus(o.value);
                }}
              >
                {o.label}
              </div>
            ))}
      </div>
    </div>,
  ];

  const isManager =
    login._id == queueContext.data.owner ||
    queueContext.data.admins.includes(login._id);

  return (
    <div
      className={
        open
          ? loading
            ? "managerequestpanel open loading"
            : "managerequestpanel open"
          : "managerequestpanel closed"
      }
      onClick={(ev) => {
        auxClosePanel(ev);
      }}
      onKeyDown={escClosePanel}
    >
      <div className="container">
        <div className="paneltitle">
          {isManager ? "Manage Request" : "Request Details"}
          <FontAwesomeIcon
            icon={faTimes}
            color="#fff"
            onClick={() => {
              close();
            }}
            style={{
              display: "block",
              marginLeft: "auto",
            }}
          />
        </div>
        <BeatmapsetBanner request={request} status={request.status} />
        <div className={isManager ? "tab invisible" : "tab"}>
          <div
            className={tab == 0 ? "option selected" : "option"}
            onClick={() => {
              setTab(0);
            }}
          >
            Discussion
          </div>
          <div
            className={tab == 1 ? "option selected" : "option"}
            onClick={() => {
              setTab(1);
            }}
          >
            Manage
          </div>
        </div>
        {tabs[tab]}
      </div>
    </div>
  );
};
