import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { QueuePanelContext } from "../../providers/QueuePanelContext";
import "./../../styles/QueuePanel.css";
import { Checkbox, modalClasses, Switch } from "@mui/material";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import { useSnackbar } from "notistack";
import TagsInput from "../global/TagsInput";
import MDEditor from "@uiw/react-md-editor";
import Markdown from "markdown-to-jsx";

export default () => {
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const { open, setOpen } = useContext(QueuePanelContext);
  const [_queue, setQueue] = useState<any>();
  const [queueRules, setQueueRules] = useState(
    _queue ? _queue.description : { description: "" }.description
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (login._id == -1) return;

    document.addEventListener("keydown", (ev) => {
      if (!ev.target) return;
      if (ev.key != "Escape") return;

      setOpen(false);

      return;
    });

    fetch(`/api/queues/${login._id}`)
      .then((r) => r.json())
      .then((d) => {
        setQueue(d.data);
        setQueueRules(d.data.description);
      });
  }, []);

  function updateQueueOption(key: string, value: any) {
    _queue[key] = value;
    setQueue(_queue);

    fetch(`/api/queues/update`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: login.account_token,
      },
      body: JSON.stringify(_queue),
    })
      .then((r) => r.json())
      .then((d) => {
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
        });
      });
  }

  function auxClosePanel(ev: any) {
    if (ev.target.className != "queuepanel open") return;

    setOpen(!open);

    return;
  }

  function escClosePanel(ev: any) {
    if (ev.target.className != "queuepanel open") return;
    if (ev.key != "escape") return;

    setOpen(!open);

    return;
  }

  function getQueueModes(mode: number) {
    return _queue.modes.find((m: number) => m == mode) != undefined;
  }

  function setQueueModes(mode: number, add: boolean) {
    console.log(mode, add);

    if (!add && _queue.modes.includes(mode)) {
      const index = _queue.modes.findIndex((m: number) => m == mode);
      _queue.modes.splice(index, 1);

      setQueue(_queue);

      fetch(`/api/queues/update`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: login.account_token,
        },
        body: JSON.stringify(_queue),
      })
        .then((r) => r.json())
        .then((d) => {
          enqueueSnackbar(d.message, {
            variant: d.status == 200 ? "success" : "error",
          });
        });
    } else {
      if (_queue.modes.findIndex((m: number) => m == mode) != -1) return;

      if (mode > 3 || mode < 0) return;

      _queue.modes.push(mode);

      setQueue(_queue);

      fetch(`/api/queues/update`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: login.account_token,
        },
        body: JSON.stringify(_queue),
      })
        .then((r) => r.json())
        .then((d) => {
          enqueueSnackbar(d.message, {
            variant: d.status == 200 ? "success" : "error",
          });
        });
    }
  }

  return (
    <div
      className={open ? "queuepanel open" : "queuepanel closed"}
      onClick={(ev) => {
        auxClosePanel(ev);
      }}
      onKeyDown={escClosePanel}
      key={"queuepanel"}
    >
      <div className="container">
        <div className="paneltitle">
          Queue settings
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
          {!_queue ? (
            <></>
          ) : (
            <>
              <div className="option">
                <p>Open:</p>
                <Switch
                  defaultChecked={_queue.open}
                  onInput={(ev: any) => {
                    updateQueueOption("open", ev.target.checked);
                  }}
                ></Switch>
              </div>
              <div className="option">
                <p>Allow graveyard beatmaps:</p>
                <Switch
                  defaultChecked={_queue.allow.graveyard}
                  onInput={(ev: any) => {
                    updateQueueOption("allow", {
                      graveyard: ev.target.checked,
                      wip: _queue.allow.wip,
                      cross: _queue.allow.cross,
                    });
                  }}
                ></Switch>
              </div>
              <div className="option">
                <p>Allow wip beatmaps:</p>
                <Switch
                  defaultChecked={_queue.allow.wip}
                  onInput={(ev: any) => {
                    updateQueueOption("allow", {
                      wip: ev.target.checked,
                      graveyard: _queue.allow.graveyard,
                      cross: _queue.allow.cross,
                    });
                  }}
                ></Switch>
              </div>
              <div className="option">
                <p>Allow cross request:</p>
                <Switch
                  defaultChecked={_queue.allow.cross}
                  onInput={(ev: any) => {
                    updateQueueOption("allow", {
                      wip: _queue.allow.wip,
                      graveyard: _queue.allow.graveyard,
                      cross: ev.target.checked,
                    });
                  }}
                ></Switch>
              </div>
              <div className="separator"></div>
              <div className="option">
                <p>Max pending requests:</p>
                <input
                  type="number"
                  defaultValue={_queue.autoclose.size}
                  min={-1}
                  max={50}
                  style={{
                    marginLeft: "5px",
                  }}
                  onInput={(ev: any) => {
                    updateQueueOption("autoclose", {
                      enable: _queue.autoclose.enable,
                      size: Number(ev.target.value),
                    });
                  }}
                />
              </div>
              <div className="option">
                <p>Auto-Close after limit:</p>
                <Switch
                  defaultChecked={_queue.autoclose.enable}
                  onInput={(ev: any) => {
                    updateQueueOption("autoclose", {
                      enable: ev.target.checked,
                      size: _queue.autoclose.size,
                    });
                  }}
                />
              </div>
              <div className="separator"></div>
              <div className="option  wide">
                <p>Preferences:</p>
                <TagsInput
                  value={_queue.genres}
                  onInput={(tags: string[]) => {
                    console.log(tags);
                    updateQueueOption("genres", tags);
                  }}
                ></TagsInput>
              </div>
              <div className="separator"></div>
              <div className="option  wide">
                <p>Modes:</p>
                <div className="row">
                  osu!:{" "}
                  <Checkbox
                    defaultChecked={getQueueModes(0)}
                    onInput={(ev) => {
                      const target: any = ev.target;
                      setQueueModes(0, target.checked);
                    }}
                  ></Checkbox>
                  osu!taiko:{" "}
                  <Checkbox
                    defaultChecked={getQueueModes(1)}
                    onInput={(ev) => {
                      const target: any = ev.target;

                      setQueueModes(1, target.checked);
                    }}
                  ></Checkbox>
                  osu!catch:{" "}
                  <Checkbox
                    defaultChecked={getQueueModes(2)}
                    onInput={(ev) => {
                      const target: any = ev.target;

                      setQueueModes(2, target.checked);
                    }}
                  ></Checkbox>
                  osu!mania:{" "}
                  <Checkbox
                    defaultChecked={getQueueModes(3)}
                    onInput={(ev) => {
                      const target: any = ev.target;

                      setQueueModes(3, target.checked);
                    }}
                  ></Checkbox>
                </div>
              </div>
              <div className="separator"></div>
              <div className="option wide">
                <p>Rules:</p>
                <div className="wrapper">
                  <MDEditor
                    className="rulespreview"
                    value={queueRules || ""}
                    autoSave="true"
                    fullscreen={false}
                    extraCommands={[]}
                    textareaProps={{
                      onBlur: () => {
                        updateQueueOption("description", queueRules);
                      },
                    }}
                    onChange={(value: any) => {
                      setQueueRules(value);
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
