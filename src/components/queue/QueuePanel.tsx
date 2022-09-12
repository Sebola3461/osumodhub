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
import moment from "moment";
import Markdown from "markdown-to-jsx";
import { queue } from "sharp";
import { useNavigate } from "react-router-dom";
import AdminInput from "../global/AdminInput";

export default () => {
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));
  const { open, setOpen } = useContext(QueuePanelContext);
  const [personalQueue, setPersonalQueue] = useState<any>();
  const [_queue, setQueue] = useState<any>();
  const [queueRules, setQueueRules] = useState(
    _queue ? _queue.description : { description: "" }.description
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [groups, setGroups] = useState([]);

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

  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route, { replace: false }), [navigate];
  };

  useEffect(() => {
    if (login._id == -1) return;

    document.addEventListener("keydown", (ev) => {
      if (!ev.target) return;
      if (ev.key != "Escape") return;

      setOpen(false);

      return;
    });

    fetch(`/api/queues/${login._id}`, {
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        setQueue(d.data);
        setQueueRules(d.data.description);
        setPersonalQueue(d.data);

        fetch(`/api/users/groups`, {
          headers: {
            authorization: login.account_token,
          },
        })
          .then((r) => r.json())
          .then((data) => {
            d.data.name = "Personal queue";
            let _groups = [d.data];

            data.data.forEach((group) => {
              _groups.push(group);
            });
            setGroups(_groups);
          });
      });
  }, []);

  function updateQueueOption(key: string, value: any) {
    _queue[key] = value;
    setQueue(_queue);

    if (_queue.isGroup == true) {
      const i = groups.findIndex((g) => g._id == _queue._id);
      groups[i] = _queue;
    } else {
      setPersonalQueue(_queue);
    }

    fetch(
      _queue.isGroup
        ? `/api/queues/update/group/${_queue._id}`
        : `/api/queues/update`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: login.account_token,
        },
        body: JSON.stringify(_queue),
      }
    )
      .then((r) => r.json())
      .then((d) => {
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
          action: action,
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

  function setQueueWebhookTag(tag: string, add: boolean, _queue) {
    if (add) {
      if (!_queue.webhook || !_queue.webhook.notify.includes(tag))
        _queue.webhook.notify.push(tag);

      console.log(_queue);
    } else {
      if (!_queue.webhook)
        _queue.webhook = {
          notify: [""],
          url: "",
        };

      if (_queue.webhook.notify.includes(tag))
        _queue.webhook.notify.filter((t) => t != tag);
    }

    setQueue(JSON.parse(JSON.stringify(_queue)));

    fetch(
      _queue.isGroup
        ? `/api/queues/update/group/${_queue._id}`
        : `/api/queues/update`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: login.account_token,
        },
        body: JSON.stringify(_queue),
      }
    )
      .then((r) => r.json())
      .then((d) => {
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
          action: action,
        });
      });
  }

  function updateWebhookURL(url: string, _queue) {
    if (!_queue.webhook)
      _queue.webhook = {
        notify: [""],
        url: url,
      };

    _queue.webhook.url = url;

    setQueue(JSON.parse(JSON.stringify(_queue)));

    fetch(
      _queue.isGroup
        ? `/api/queues/update/group/${_queue._id}`
        : `/api/queues/update`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: login.account_token,
        },
        body: JSON.stringify(_queue),
      }
    )
      .then((r) => r.json())
      .then((d) => {
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
          action: action,
        });
      });
  }

  function setQueueModes(mode: number, add: boolean, _queue) {
    if (!add && _queue.modes.includes(mode)) {
      const index = _queue.modes.findIndex((m: number) => m == mode);
      _queue.modes.splice(index, 1);

      setQueue(_queue);

      fetch(
        _queue.isGroup
          ? `/api/queues/update/group/${_queue._id}`
          : `/api/queues/update`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: login.account_token,
          },
          body: JSON.stringify(_queue),
        }
      )
        .then((r) => r.json())
        .then((d) => {
          enqueueSnackbar(d.message, {
            variant: d.status == 200 ? "success" : "error",
            action: action,
          });
        });
    } else {
      if (_queue.modes.findIndex((m: number) => m == mode) != -1) return;

      if (mode > 3 || mode < 0) return;

      _queue.modes.push(mode);

      setQueue(_queue);

      fetch(
        _queue.isGroup
          ? `/api/queues/update/group/${_queue._id}`
          : `/api/queues/update`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: login.account_token,
          },
          body: JSON.stringify(_queue),
        }
      )
        .then((r) => r.json())
        .then((d) => {
          enqueueSnackbar(d.message, {
            variant: d.status == 200 ? "success" : "error",
            action: action,
          });
        });
    }
  }

  function scheduleQueue() {
    fetch(`/api/queues/schedule`, {
      method: "POST",
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
          action: action,
        });

        if (d.status == 200) {
          _queue.timeclose.scheduled = new Date();
          setQueue(_queue);
        }
      });
  }

  async function importFromOsumod() {
    fetch(`/api/queues/import/osumod`, {
      method: "POST",
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
          action: action,
        });
      });
  }

  function testWebhook() {
    fetch(`/api/queues/${_queue._id}/webhook/`, {
      method: "POST",
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
          action: action,
        });
      });
  }

  function deleteQueue() {
    if (confirm("Are you sure?")) {
      fetch(`/api/queues/${_queue._id}`, {
        method: "DELETE",
        headers: {
          authorization: login.account_token,
        },
      })
        .then((r) => r.json())
        .then((d) => {
          enqueueSnackbar(d.message, {
            variant: d.status == 200 ? "success" : "error",
            action: action,
          });

          if (d.status == 200) {
            let _groups = groups.filter((g) => g._id != _queue._id);
            setGroups(_groups);

            setQueue(personalQueue);
          }
        });
    }
  }

  function removeWebhook() {
    if (confirm("Are you sure?")) {
      fetch(`/api/queues/${_queue._id}/webhook/`, {
        method: "DELETE",
        headers: {
          authorization: login.account_token,
        },
      })
        .then((r) => r.json())
        .then((d) => {
          enqueueSnackbar(d.message, {
            variant: d.status == 200 ? "success" : "error",
            action: action,
          });

          if (d.status == 200) {
            _queue.webhook = {
              url: "",
              notify: [""],
            };

            setQueue(JSON.parse(JSON.stringify(_queue)));
          }
        });
    }
  }

  // TODO: Fix the fucking time update
  return (
    <div
      className={open ? "queuepanel open" : "queuepanel closed"}
      onClick={(ev) => {
        auxClosePanel(ev);
      }}
      onKeyDown={escClosePanel}
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
              <div className="selectqueue">
                <p>Select queue:</p>
                <select
                  className="groups"
                  key={GenerateComponentKey(10)}
                  defaultValue={_queue._id}
                  onInput={(ev: any) => {
                    const groupIndex = groups.findIndex(
                      (g) => g._id == ev.target.value
                    );

                    if (groupIndex != -1) {
                      setQueue(groups[groupIndex]);
                      setQueueRules(groups[groupIndex].description);
                    } else {
                      setQueue(personalQueue);
                      setQueueRules(personalQueue.description);
                    }
                  }}
                >
                  {groups.map((g) => (
                    <option value={g._id} key={GenerateComponentKey(10)}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="separator"></div>
              {!_queue.isGroup ? (
                <></>
              ) : (
                <>
                  <div className="option">
                    <p>Group name:</p>
                    <input
                      type="text"
                      defaultValue={_queue.name}
                      style={{
                        marginLeft: "5px",
                      }}
                      onBlur={(ev: any) => {
                        updateQueueOption("name", ev.target.value);
                      }}
                    />
                  </div>
                  <div className="option">
                    <p>Icon URL:</p>
                    <input
                      type="text"
                      defaultValue={_queue.icon}
                      style={{
                        marginLeft: "5px",
                      }}
                      onBlur={(ev: any) => {
                        updateQueueOption("icon", ev.target.value);
                      }}
                    />
                  </div>
                  <div className="option">
                    <p>Banner URL:</p>
                    <input
                      type="text"
                      defaultValue={_queue.banner}
                      style={{
                        marginLeft: "5px",
                      }}
                      onBlur={(ev: any) => {
                        updateQueueOption("banner", ev.target.value);
                      }}
                    />
                  </div>
                  <div className="separator"></div>
                </>
              )}
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
              {_queue.isGroup ? (
                <></>
              ) : (
                <>
                  <div className="option">
                    <p>Enable time-close:</p>
                    <Switch
                      defaultChecked={_queue.autoclose.enable}
                      onInput={(ev: any) => {
                        updateQueueOption("timeclose", {
                          enable: ev.target.checked,
                          size: _queue.timeclose.size,
                        });
                      }}
                    />
                  </div>
                  <div className="option">
                    <p>Close after (days):</p>
                    <input
                      type="number"
                      defaultValue={_queue.timeclose.size}
                      min={1}
                      max={31}
                      style={{
                        marginLeft: "5px",
                      }}
                      key={GenerateComponentKey(10)}
                      onInput={(ev: any) => {
                        _queue.timeclose.size = Number(ev.target.value);

                        updateQueueOption("autoclose", {
                          enable: _queue.timeclose.enable,
                          size: Number(ev.target.value),
                        });
                      }}
                    />
                  </div>
                  <div
                    className="row timerrow"
                    key={_queue.timeclose.scheduled}
                  >
                    <button className="custombutton" onClick={scheduleQueue}>
                      Start timer
                    </button>
                    {moment(_queue.timeclose.scheduled)
                      .add(_queue.timeclose.size, "days")
                      .toDate()
                      .valueOf() >= new Date().valueOf() ? (
                      <p>
                        Your queue will close{" "}
                        {moment(_queue.timeclose.scheduled)
                          .add(_queue.timeclose.size, "days")
                          .calendar()}{" "}
                        UTC
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="separator"></div>
                </>
              )}
              <div className="option  wide">
                <p>Preferences:</p>
                <TagsInput
                  key={GenerateComponentKey(10)}
                  value={_queue.genres}
                  onInput={(tags: string[]) => {
                    updateQueueOption("genres", tags);
                  }}
                ></TagsInput>
              </div>
              <div className="separator"></div>
              <div className="option wide modes">
                <p>Modes:</p>
                <div className="row modes">
                  <div>
                    osu!:{" "}
                    <Checkbox
                      key={GenerateComponentKey(10)}
                      defaultChecked={getQueueModes(0)}
                      onInput={(ev) => {
                        const target: any = ev.target;
                        setQueueModes(0, target.checked, _queue);
                      }}
                    ></Checkbox>
                  </div>
                  <div>
                    osu!taiko:{" "}
                    <Checkbox
                      key={GenerateComponentKey(10)}
                      defaultChecked={getQueueModes(1)}
                      onInput={(ev) => {
                        const target: any = ev.target;

                        setQueueModes(1, target.checked, _queue);
                      }}
                    ></Checkbox>
                  </div>
                  <div>
                    osu!catch:{" "}
                    <Checkbox
                      key={GenerateComponentKey(10)}
                      defaultChecked={getQueueModes(2)}
                      onInput={(ev) => {
                        const target: any = ev.target;

                        setQueueModes(2, target.checked, _queue);
                      }}
                    ></Checkbox>
                  </div>
                  <div>
                    osu!mania:{" "}
                    <Checkbox
                      key={GenerateComponentKey(10)}
                      defaultChecked={getQueueModes(3)}
                      onInput={(ev) => {
                        const target: any = ev.target;

                        setQueueModes(3, target.checked, _queue);
                      }}
                    ></Checkbox>
                  </div>
                </div>
              </div>
              <div className="separator"></div>
              <div className="option">
                <p>Webhook URL:</p>
                <input
                  type="text"
                  defaultValue={_queue.webhook ? _queue.webhook.url : ""}
                  style={{
                    marginLeft: "5px",
                  }}
                  key={GenerateComponentKey(10)}
                  onInput={(ev: any) => {
                    updateWebhookURL(ev.target.value, _queue);
                  }}
                />
                <button onClick={testWebhook} className="import">
                  Test
                </button>
                <button onClick={removeWebhook} className="import">
                  remove
                </button>
              </div>
              <div className="option wide modes">
                <p>Scopes:</p>
                <div className="row modes">
                  <div>
                    Request updates:{" "}
                    <Checkbox
                      defaultChecked={
                        _queue.webhook
                          ? _queue.webhook.notify.includes("request:update")
                          : false
                      }
                      onInput={(ev) => {
                        const target: any = ev.target;
                        setQueueWebhookTag(
                          "request:update",
                          target.checked,
                          _queue
                        );
                      }}
                    ></Checkbox>
                  </div>
                  <div>
                    New requests:{" "}
                    <Checkbox
                      defaultChecked={
                        _queue.webhook
                          ? _queue.webhook.notify.includes("request:new")
                          : false
                      }
                      onInput={(ev) => {
                        const target: any = ev.target;

                        setQueueWebhookTag(
                          "request:new",
                          target.checked,
                          _queue
                        );
                      }}
                    ></Checkbox>
                  </div>
                  <div>
                    Queue status:{" "}
                    <Checkbox
                      defaultChecked={
                        _queue.webhook
                          ? _queue.webhook.notify.includes("queue:state")
                          : false
                      }
                      onInput={(ev) => {
                        const target: any = ev.target;

                        setQueueWebhookTag(
                          "queue:state",
                          target.checked,
                          _queue
                        );
                      }}
                    ></Checkbox>
                  </div>
                </div>
              </div>
              {_queue.isGroup ? (
                <></>
              ) : (
                <>
                  <div className="separator"></div>
                  <div className="option">
                    <p>Import from another website:</p>
                    <button onClick={importFromOsumod} className="import">
                      Import from osumod
                    </button>
                  </div>
                </>
              )}
              <div className="separator"></div>
              {!_queue.isGroup ? (
                <></>
              ) : (
                <>
                  <div className="option  wide">
                    <p>Admins:</p>
                    <AdminInput
                      defaultValue={_queue.admins}
                      onInput={(admins) => {
                        updateQueueOption(
                          "admins",
                          admins.map((admin) => admin._id)
                        );
                      }}
                    ></AdminInput>
                    <button onClick={deleteQueue} className="import">
                      Delete Queue
                    </button>
                  </div>
                  <div className="separator"></div>
                </>
              )}

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
