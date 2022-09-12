import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import "./../../styles/CreateGroupPanel.css";
import { useSnackbar } from "notistack";
import { ConfirmDialogContext } from "../../providers/ConfirmDialogContext";
import { CreateGroupPanelContext } from "../../providers/CreateGroupContext";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { request } from "express";
import TagsInput from "./TagsInput";
import { useNavigate } from "react-router-dom";
import AdminInput from "./AdminInput";

export default () => {
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const [loading, setLoading] = useState(false);
  const { open, setOpen } = useContext(CreateGroupPanelContext);
  const dialog = useContext(ConfirmDialogContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [data, setData] = useState({
    name: "",
    icon: "",
    banner: "",
    admins: [],
  });

  function auxClosePanel(ev: any) {
    if (ev.target.className != "requestpanel open") return;

    setOpen(!open);

    return;
  }

  function escClosePanel(ev: any) {
    if (ev.target.className != "requestpanel open") return;
    if (ev.key != "escape") return;

    setOpen(false);

    return;
  }

  function updateData(target: string, value: any) {
    data[target] = value;
    setData(data);
  }

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  function create(data) {
    if (!data.name || data.admins.length == 0)
      return enqueueSnackbar("You need to provide a valid name and admins", {
        variant: "error",
      });

    fetch(`/api/queues/new/group`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: login.account_token,
      },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status != 200)
          return enqueueSnackbar(d.message, {
            variant: "error",
          });

        goTo(`/queue/${d.data._id}`);
        setOpen(false);
      });
  }

  return (
    <div
      className={
        open ? "createnewgrouppanel open" : "createnewgrouppanel closed"
      }
      onClick={(ev) => {
        auxClosePanel(ev);
      }}
      onKeyDown={escClosePanel}
    >
      <div className="container customscroll">
        <div className="paneltitle">
          Create Group
          <FontAwesomeIcon
            icon={faTimes}
            color="#fff"
            onClick={() => {
              setOpen(false);
            }}
            style={{
              display: "block",
              marginLeft: "auto",
            }}
          />
        </div>
        <div className="options">
          <div className="option">
            <p>Group name:</p>
            <input
              type="text"
              onBlur={(ev: any) => {
                updateData("name", ev.target.value);
              }}
            />
          </div>
          <div className="option">
            <p>Icon URL:</p>
            <input
              type="text"
              onBlur={(ev: any) => {
                updateData("icon", ev.target.value);
              }}
            />
          </div>
          <div className="option">
            <p>Banner URL:</p>
            <input
              type="text"
              onBlur={(ev: any) => {
                updateData("banner", ev.target.value);
              }}
            />
          </div>
          <div className="option wide">
            <p>Admins:</p>
            <AdminInput
              onInput={(admins) => {
                updateData(
                  "admins",
                  admins.map((a) => a._id)
                );
              }}
            />
          </div>
          <button
            onClick={() => {
              create(data);
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
