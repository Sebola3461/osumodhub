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
import isQueueManager from "../../helpers/isQueueManager";
import { useNavigate } from "react-router-dom";
import { getLocalization } from "../../localization/localizationManager";

export default () => {
  const { login, setLogin } = useContext(AuthContext);

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

  const navigate = useNavigate();

  const goTo = (route: string, replace?: boolean) => {
    navigate(route, { replace: replace ? true : false }), [navigate];
  };

  // ? ========================================

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
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "accepted",
      ]),
      value: "accepted",
      decoration: "accept",
    },
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "rejected",
      ]),
      value: "rejected",
      decoration: "reject",
    },
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "finished",
      ]),
      value: "finished",
      decoration: "finish",
    },
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "archived",
      ]),
      value: "archived",
      decoration: "archive",
    },
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "delete",
      ]),
      value: "delete",
      decoration: "delete",
    },
  ];

  const bn_options = [
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "accepted",
      ]),
      value: "accepted",
      decoration: "accept",
    },
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "rejected",
      ]),
      value: "rejected",
      decoration: "reject",
    },
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "nominated",
      ]),
      value: "nominated",
      decoration: "nominate",
    },
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "ranked",
      ]),
      value: "ranked",
      decoration: "rank",
    },
    { label: "Waiting another BN", value: "waiting", decoration: "wait" },
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "rechecking",
      ]),
      value: "rechecking",
      decoration: "recheck",
    },
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "archived",
      ]),
      value: "archived",
      decoration: "archive",
    },
    {
      label: getLocalization(login.language, [
        "requests",
        "actionStatus",
        "delete",
      ]),
      value: "delete",
      decoration: "delete",
    },
  ];

  function close() {
    const _targetRequest = new URLSearchParams(location.search).get("r");

    if (_targetRequest) {
      goTo(`/queue/${queueContext.data._id}`, true);
    }

    setOpen(false);
  }

  useEffect(() => {
    if (open) {
      goTo(`/queue/${queueContext.data._id}?r=${request._id}`, true);
    }
  }, [open]);

  if (!queueContext.data || !queueContext.requests) return <></>;
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
            {request.comment ||
              getLocalization(login.language, [
                "requests",
                "status",
                "noMapperComment",
              ])}
          </div>
        </div>
        {request._managers.map((manager) => {
          return (
            <div className="modderreply comment">
              <div className="metadata">
                <div
                  className="userpfp"
                  style={{
                    backgroundImage: `url(https://a.ppy.sh/${manager.userId})`,
                  }}
                ></div>
                <p className="username">
                  {manager.username}
                  <Tag
                    content={
                      queueContext.data.isGroup
                        ? "Manager"
                        : queueContext.data.type
                    }
                    type={
                      queueContext.data.isGroup
                        ? "modder"
                        : queueContext.data.type
                    }
                  />
                  <Tag
                    content={getLocalization(login.language, [
                      "requests",
                      "status",
                      `${manager.status}`,
                    ])}
                    type={manager.status}
                  />
                </p>
              </div>
              <div className="content">
                {manager.feedback ||
                  getLocalization(login.language, [
                    "requests",
                    "status",
                    "noFeedback",
                  ])}
              </div>
            </div>
          );
        })}
      </div>
    </div>,
    <div className="actionslayout customscroll">
      <div className="replycontainer">
        <p>
          <FontAwesomeIcon icon={faMessage} />
          {getLocalization(login.language, [
            "manageRequestPanel",
            "manageTab",
            "feedbackTitle",
          ])}
        </p>
        <textarea
          className="request-reply"
          defaultValue={request.reply}
          placeholder={getLocalization(login.language, [
            "manageRequestPanel",
            "manageTab",
            "placeholder",
          ])}
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
          {isQueueManager(queueContext.data, login)
            ? "Manage Request"
            : "Request Details"}
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
        <BeatmapsetBanner
          request={request}
          status={getLocalization(login.language, [
            "requests",
            "status",
            `${request.status}`,
          ])}
        />
        <div
          className={
            isQueueManager(queueContext.data, login) ? "tab" : "tab invisible"
          }
        >
          <div
            className={tab == 0 ? "option selected" : "option"}
            onClick={() => {
              setTab(0);
            }}
          >
            {getLocalization(login.language, [
              "manageRequestPanel",
              "tabs",
              "discussion",
            ])}
          </div>
          <div
            className={tab == 1 ? "option selected" : "option"}
            onClick={() => {
              setTab(1);
            }}
          >
            {getLocalization(login.language, [
              "manageRequestPanel",
              "tabs",
              "manage",
            ])}
          </div>
        </div>
        {tabs[tab]}
      </div>
    </div>
  );
};
