import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { ManageRequestPanelContext } from "../../providers/ManageRequestPanelContext";
import { Beatmapset } from "../../types/beatmap";
import "./../../styles/ManageRequestPanel.css";
import RequestViewer, { IRequest } from "../global/RequestViewer";
import RequestSelector from "../global/RequestSelector";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import { useSnackbar } from "notistack";

export default ({ queue, setRequests, requests }: any) => {
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const [loading, setLoading] = useState(false);
  const { open, request, setOpen, setRequest } = useContext(
    ManageRequestPanelContext
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
    setLoading(true);
    if (status == "delete") return deleteRequest();

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

          const index = requests.findIndex((r) => r._id == request._id);
          requests[index]["status"] = status;
          requests[index]["reply"] = request.reply;
          setRequests(requests);
        }
      });

    function deleteRequest() {
      if (confirm("Are you sure?")) {
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
              setRequests(requests.filter((r) => r._id != request._id));
            }
          });
      }
    }
  }

  const modder_options = [
    <div
      className="option accepted"
      onClick={() => {
        updateRequestStatus("accepted");
      }}
    >
      accepted
    </div>,
    <div
      className="option rejected"
      onClick={() => {
        updateRequestStatus("rejected");
      }}
    >
      rejected
    </div>,
    <div
      className="option finished"
      onClick={() => {
        updateRequestStatus("finished");
      }}
    >
      finished
    </div>,
    <div
      className="option archived"
      onClick={() => {
        updateRequestStatus("archived");
      }}
    >
      archived
    </div>,
    <div
      className="option rejected"
      onClick={() => {
        updateRequestStatus("delete");
      }}
    >
      delete
    </div>,
  ];

  const bn_options = [
    <div
      className="option accepted"
      onClick={() => {
        updateRequestStatus("accepted");
      }}
    >
      accepted
    </div>,
    <div
      className="option rejected"
      onClick={() => {
        updateRequestStatus("rejected");
      }}
    >
      rejected
    </div>,
    <div
      className="option finished"
      onClick={() => {
        updateRequestStatus("nominated");
      }}
    >
      nominated
    </div>,
    <div
      className="option ranked"
      onClick={() => {
        updateRequestStatus("ranked");
      }}
    >
      ranked
    </div>,
    <div
      className="option waiting"
      onClick={() => {
        updateRequestStatus("waiting");
      }}
    >
      waiting
    </div>,
    <div
      className="option rechecking"
      onClick={() => {
        updateRequestStatus("rechecking");
      }}
    >
      recheck
    </div>,
    <div
      className="option archived"
      onClick={() => {
        updateRequestStatus("archived");
      }}
    >
      archived
    </div>,
    <div
      className="option rejected"
      onClick={() => {
        updateRequestStatus("delete");
      }}
    >
      delete
    </div>,
  ];

  function getReply() {
    if (request.reply == "" && login._id != queue._id) return "";

    return request.reply;
  }

  function close() {
    const _targetRequest = new URLSearchParams(location.search).get("r");

    if (_targetRequest) {
      history.pushState(null, "", window.location.pathname);
    }

    setOpen(false);
  }

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
          {login._id == queue._id ? "Manage Request" : "Request Details"}
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
        <div className="layout">
          <RequestViewer
            key={GenerateComponentKey(20)}
            request={request}
            type="manage"
          ></RequestViewer>
          <div className="vertical">
            <textarea
              key={GenerateComponentKey(29)}
              placeholder={
                login._id == queue._id
                  ? "Type a reply for this request"
                  : "No reply provided..."
              }
              defaultValue={getReply()}
              className={login._id == queue._id ? "owner" : "guest"}
              onKeyUp={(ev: any) => {
                updateRequestReply(ev.target.value);
              }}
              readOnly={login._id != queue._id}
            ></textarea>
            <div
              className="options"
              style={{
                display: `${login._id == queue._id ? "flex" : "none"}`,
              }}
            >
              {["BN", "NAT"].includes(queue.type)
                ? bn_options.map((o) => o)
                : modder_options.map((o) => o)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
