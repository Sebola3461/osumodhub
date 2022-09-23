import {
  faBarsStaggered,
  faCheck,
  faClipboardList,
  faClock,
  faDownload,
  faExclamationCircle,
  faPuzzlePiece,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
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
import { useNavigate } from "react-router-dom";
import AdminInput from "../global/AdminInput";
import { useSwipeable } from "react-swipeable";

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
  const [tab, setTab] = useState(0);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => setCategoriesOpen(false),
    onSwipedRight: (eventData) => setCategoriesOpen(true),
  });

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
      setGroups(groups);
    } else {
      setPersonalQueue(_queue);
    }
  }

  function saveUpdates(target: string) {
    fetch(`/api/queues/${_queue._id}/update?target=${target}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: login.account_token,
      },
      body: JSON.stringify({
        value:
          target == "metadata"
            ? { name: _queue.name, icon: _queue.icon, banner: _queue.banner }
            : _queue[target],
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
          action: action,
        });
      });
  }

  function auxClosePanel(ev: any) {
    if (ev.target.className != "queuepanel open customscroll") return;

    setOpen(!open);

    return;
  }

  function escClosePanel(ev: any) {
    if (ev.target.className != "queuepanel openqueuepanel open customscroll")
      return;
    if (ev.key != "escape") return;

    setOpen(!open);

    return;
  }

  function getQueueModes(mode: number) {
    return _queue.modes.find((m: number) => m == mode) != undefined;
  }

  function setQueueWebhookTag(tag: string, add: boolean) {
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
        _queue.webhook.notify = _queue.webhook.notify.filter((t) => t != tag);
    }

    setQueue(_queue);
  }

  function updateWebhookURL(url: string) {
    if (!_queue.webhook)
      _queue.webhook = {
        notify: [""],
        url: url,
      };

    _queue.webhook.url = url;

    setQueue(_queue);
  }

  function setQueueModes(mode: number, add: boolean, _queue) {
    if (!add && _queue.modes.includes(mode)) {
      const index = _queue.modes.findIndex((m: number) => m == mode);
      _queue.modes.splice(index, 1);

      setQueue(_queue);
    } else {
      if (_queue.modes.findIndex((m: number) => m == mode) != -1) return;

      if (mode > 3 || mode < 0) return;

      _queue.modes.push(mode);

      setQueue(_queue);
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
            setTab(0);
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

  // useEffect(() => {
  //   console.log("eae");
  //   if (_queue && queueRules != _queue.description) {
  //     setQueueRules(_queue ? _queue.description : "");
  //   }
  // }, [_queue]);

  if (!_queue) return <></>;

  let categories = [
    <div
      className={tab == 0 ? "category selected" : "category"}
      onClick={() => {
        setTab(0);
        setCategoriesOpen(false);
      }}
    >
      <FontAwesomeIcon icon={faBarsStaggered} />
      <p>General</p>
    </div>,
    <div
      className={tab == 1 ? "category selected" : "category"}
      onClick={() => {
        setTab(1);
        setCategoriesOpen(false);
      }}
    >
      <FontAwesomeIcon icon={faClipboardList} />
      <p>Requests</p>
    </div>,
    <div
      className={tab == 3 ? "category selected" : "category"}
      onClick={() => {
        setTab(3);
        setCategoriesOpen(false);
      }}
    >
      <FontAwesomeIcon icon={faPuzzlePiece} />
      <p>Modules</p>
    </div>,
  ];

  if (_queue.isGroup) {
    categories = categories.concat([
      <>
        <div
          className={tab == 2 ? "category selected" : "category"}
          onClick={() => {
            setTab(2);
            setCategoriesOpen(false);
          }}
        >
          <FontAwesomeIcon icon={faUser} />
          <p>Admin</p>
        </div>
      </>,
    ]);
  }

  const tabs = [
    <>
      <div className="option-container" key={GenerateComponentKey(10)}>
        <p className="title">
          Queue Status
          <span></span>
        </p>
        <div className="section horizontal">
          <Switch
            defaultChecked={_queue.open}
            onInput={(ev: any) => {
              updateQueueOption("open", ev.target.checked);
            }}
          />
          <p className="label">Open</p>
        </div>
        <div className="action-buttons-row">
          <button
            className="save-button"
            onClick={() => {
              saveUpdates("open");
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </button>
        </div>
      </div>
      <div
        className={
          !_queue.isGroup ? "option-container invisible" : "option-container"
        }
        key={GenerateComponentKey(10)}
      >
        <p className="title">
          Group Info.
          <span></span>
        </p>
        <div className="section" key={GenerateComponentKey(10)}>
          <p className="label">Name</p>
          <input
            defaultValue={_queue.name}
            className="biginput"
            placeholder="My queue"
            type="text"
            onInput={(ev: any) => {
              updateQueueOption("name", ev.target.value);
            }}
          />
        </div>
        <div className="section" key={GenerateComponentKey(10)}>
          <p className="label">Icon URL</p>
          <input
            defaultValue={_queue.icon}
            className="biginput"
            placeholder="https://images.com/image.png"
            type="text"
            onInput={(ev: any) => {
              updateQueueOption("icon", ev.target.value);
            }}
          />
        </div>
        <div className="section" key={GenerateComponentKey(10)}>
          <p className="label">Banner URL</p>
          <input
            defaultValue={_queue.banner}
            className="biginput"
            placeholder="https://images.com/image.png"
            type="text"
            onInput={(ev: any) => {
              updateQueueOption("banner", ev.target.value);
            }}
          />
        </div>
        <div className="action-buttons-row">
          <button
            className="save-button"
            onClick={() => {
              saveUpdates("metadata");
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </button>
        </div>
      </div>
      <div className="option-container">
        <p className="title">
          Rules
          <span></span>
        </p>
        <div className="section horizontal">
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
        <div className="action-buttons-row">
          <button
            className="save-button"
            onClick={() => {
              saveUpdates("description");
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </button>
        </div>
      </div>
      <div className="option-container">
        <p className="title">
          Preferences
          <span></span>
        </p>
        <div className="section horizontal" key={GenerateComponentKey(10)}>
          <TagsInput
            value={_queue.genres}
            onInput={(tags) => {
              updateQueueOption("genres", tags);
            }}
          />
        </div>
        <div className="action-buttons-row" key={GenerateComponentKey(10)}>
          <button
            className="save-button"
            onClick={() => {
              saveUpdates("genres");
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </button>
        </div>
      </div>
      <div className="option-container">
        <p className="title">
          Allowed Gamemodes
          <span></span>
        </p>
        <div className="section horizontal" key={GenerateComponentKey(10)}>
          <Checkbox
            defaultChecked={getQueueModes(0)}
            onInput={(ev: any) => {
              setQueueModes(0, ev.target.checked, _queue);
            }}
          />
          <p className="label">osu!</p>
        </div>
        <div className="section horizontal" key={GenerateComponentKey(10)}>
          <Checkbox
            defaultChecked={getQueueModes(1)}
            onInput={(ev: any) => {
              setQueueModes(1, ev.target.checked, _queue);
            }}
          />
          <p className="label">osu!taiko</p>
        </div>
        <div className="section horizontal" key={GenerateComponentKey(10)}>
          <Checkbox
            defaultChecked={getQueueModes(2)}
            onInput={(ev: any) => {
              setQueueModes(2, ev.target.checked, _queue);
            }}
          />
          <p className="label">osu!catch</p>
        </div>
        <div className="section horizontal" key={GenerateComponentKey(10)}>
          <Checkbox
            defaultChecked={getQueueModes(3)}
            onInput={(ev: any) => {
              setQueueModes(3, ev.target.checked, _queue);
            }}
          />
          <p className="label">osu!mania</p>
        </div>
        <div className="action-buttons-row">
          <button
            className="save-button"
            onClick={() => {
              saveUpdates("modes");
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </button>
        </div>
      </div>
    </>,

    <>
      <div className="option-container">
        <p className="title">
          Filters
          <span></span>
        </p>
        <div className="section horizontal" key={GenerateComponentKey(10)}>
          <Checkbox
            defaultChecked={_queue.allow.graveyard}
            onInput={(ev: any) => {
              _queue.allow.graveyard = ev.target.checked;
              updateQueueOption("allow", _queue.allow);
            }}
          />
          <p className="label">Allow Graveyard beatmaps</p>
        </div>
        <div className="section horizontal" key={GenerateComponentKey(10)}>
          <Checkbox
            defaultChecked={_queue.allow.wip}
            onInput={(ev: any) => {
              _queue.allow.wip = ev.target.checked;
              updateQueueOption("allow", _queue.allow);
            }}
          />
          <p className="label">Allow Wip Beatmaps</p>
        </div>
        <div className="section horizontal" key={GenerateComponentKey(10)}>
          <Checkbox
            defaultChecked={_queue.allow.cross}
            onInput={(ev: any) => {
              _queue.allow.cross = ev.target.checked;
              updateQueueOption("allow", _queue.allow);
            }}
          />
          <p className="label">
            Allow users to request beatmaps from other users
          </p>
        </div>
        <div className="action-buttons-row">
          <button
            className="save-button"
            onClick={() => {
              saveUpdates("allow");
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </button>
        </div>
      </div>
    </>,

    <>
      <div className="option-container">
        <p className="title">
          Group Administrators
          <span></span>
        </p>
        <div className="section ">
          <AdminInput defaultValue={_queue.admins} />
        </div>
        <div className="action-buttons-row">
          <button
            className="save-button"
            onClick={() => {
              saveUpdates("admins");
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </button>
        </div>
      </div>
      <div className="option-container">
        <p className="title">
          Delete Queue
          <span></span>
        </p>
        <div className="section ">
          <button className="delete-queue-button" onClick={deleteQueue}>
            Rage quit
          </button>
        </div>
      </div>
    </>,
    <>
      <div className="option-container">
        <p className="title">
          Auto-Close
          <span></span>
        </p>
        <div className="section horizontal">
          <Switch
            defaultChecked={_queue.autoclose.enable}
            onChange={(ev: any) => {
              _queue.autoclose.enable = ev.target.checked;
              updateQueueOption("autoclose", _queue.autoclose);
            }}
          />
          <p className="label">Enable</p>
        </div>
        <div className="section">
          <p className="label">Max pending requests</p>
          <input
            defaultValue={_queue.autoclose.size}
            className="biginput"
            placeholder="Max pending requests"
            type="number"
            min={0}
            max={240}
            onInput={(ev: any) => {
              _queue.autoclose.size = Number(ev.target.value);
              updateQueueOption("autoclose", _queue.autoclose);
            }}
          />
        </div>
        <div className="action-buttons-row">
          <button
            className="save-button"
            onClick={() => {
              saveUpdates("autoclose");
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </button>
        </div>
      </div>
      <div className="option-container">
        <p className="title">
          Time-Close
          <span></span>
        </p>
        <div className="section horizontal">
          <Switch
            defaultChecked={_queue.timeclose.enable}
            onChange={(ev: any) => {
              _queue.timeclose.enable = ev.target.checked;

              updateQueueOption("timeclose", _queue.timeclose);
            }}
          />
          <p className="label">Enable</p>
        </div>
        <div className="section">
          <p className="label">Close after (days)</p>
          <input
            defaultValue={_queue.timeclose.size}
            className="biginput"
            placeholder="Days to sum"
            type="number"
            min={0}
            max={30}
            onInput={(ev: any) => {
              _queue.timeclose.size = Number(ev.target.value);
              updateQueueOption("timeclose", _queue.timeclose);
            }}
          />
        </div>
        <div className="action-buttons-row">
          <button
            className="save-button"
            onClick={() => {
              scheduleQueue();
            }}
          >
            <FontAwesomeIcon icon={faClock} />
            Start Timer
          </button>
          <button
            className="save-button"
            onClick={() => {
              saveUpdates("timeclose");
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </button>
        </div>
      </div>
      <div className="option-container">
        <p className="title">
          Webhook
          <span></span>
        </p>
        <div className="section horizontal">
          <Checkbox
            defaultChecked={_queue.webhook.notify.includes("request:update")}
            onInput={(ev: any) => {
              setQueueWebhookTag("request:update", ev.target.checked);
            }}
          />
          <p className="label">Notify request updates</p>
        </div>
        <div className="section horizontal">
          <Checkbox
            defaultChecked={_queue.webhook.notify.includes("request:new")}
            onInput={(ev: any) => {
              setQueueWebhookTag("request:new", ev.target.checked);
            }}
          />
          <p className="label">Notify new requests</p>
        </div>
        <div className="section horizontal">
          <Checkbox
            defaultChecked={_queue.webhook.notify.includes("queue:update")}
            onInput={(ev: any) => {
              setQueueWebhookTag("queue:update", ev.target.checked);
            }}
          />
          <p className="label">Notify queue update</p>
        </div>
        <div className="section">
          <p className="label">Webhook URL</p>
          <input
            defaultValue={_queue.webhook.url}
            className="biginput"
            placeholder="https://discord.com/webhooks..."
            type="text"
            min={0}
            max={100}
            onInput={(ev: any) => {
              updateWebhookURL(ev.target.value);
            }}
          />
        </div>
        <div className="action-buttons-row">
          <button
            className="save-button"
            onClick={() => {
              testWebhook();
            }}
          >
            <FontAwesomeIcon icon={faExclamationCircle} />
            Test
          </button>
          <button
            className="save-button"
            onClick={() => {
              saveUpdates("webhook");
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </button>
        </div>
      </div>
      <div className="option-container">
        <p className="title">
          External import
          <span></span>
        </p>
        <div className="section horizontal">
          <button
            className="import-button"
            onClick={() => {
              importFromOsumod();
            }}
          >
            <FontAwesomeIcon icon={faDownload} />
            Import from osumod
          </button>
        </div>
      </div>
    </>,
  ];

  return (
    <div
      className={
        open ? "queuepanel open customscroll" : "queuepanel customscroll"
      }
      {...handlers}
      onClick={auxClosePanel}
    >
      <div className="container customscroll">
        <div className="paneltitle">
          <p>Queue Settings</p>
          <FontAwesomeIcon icon={faTimes} onClick={() => setOpen(false)} />
        </div>
        <div className="layout customscroll">
          <div
            className="categories customscroll"
            data-mobile-open={categoriesOpen}
            // key={GenerateComponentKey(20)}
          >
            <div className="myqueues">
              <div
                className="icon"
                style={{
                  backgroundImage: `url(${_queue.icon})`,
                }}
              ></div>
              <p className="name">{_queue.name}</p>
              <select
                onInput={(ev: any) => {
                  setQueue(groups[Number(ev.target.value)]);
                  setQueueRules(groups[Number(ev.target.value)].description);
                }}
              >
                {groups.map((g, i) => (
                  <option value={i}>{g.name}</option>
                ))}
              </select>
            </div>
            {categories.map((tab) => tab)}
          </div>
          <div className="content customscroll">{tabs[tab]}</div>
        </div>
      </div>
    </div>
  );

  // // TODO: Fix the fucking time update
  // return (
  //   <div
  //     className={open ? "queuepanel open" : "queuepanel closed"}
  //     onClick={(ev) => {
  //       auxClosePanel(ev);
  //     }}
  //     onKeyDown={escClosePanel}
  //   >
  //     <div className="container">
  //       <div className="paneltitle">
  //         Queue settings
  //         <FontAwesomeIcon
  //           icon={faTimes}
  //           color="#fff"
  //           onClick={() => {
  //             setOpen(false);
  //           }}
  //           style={{
  //             display: "block",
  //             marginLeft: "auto",
  //           }}
  //         />
  //       </div>
  //       <div className="options">
  //         {!_queue ? (
  //           <></>
  //         ) : (
  //           <>
  //             <div className="selectqueue">
  //               <p>Select queue:</p>
  //               <select
  //                 className="groups"
  //                 key={GenerateComponentKey(10)}
  //                 defaultValue={_queue._id}
  //                 onInput={(ev: any) => {
  //                   const groupIndex = groups.findIndex(
  //                     (g) => g._id == ev.target.value
  //                   );

  //                   if (groupIndex != -1) {
  //                     setQueue(groups[groupIndex]);
  //                     setQueueRules(groups[groupIndex].description);
  //                   } else {
  //                     setQueue(personalQueue);
  //                     setQueueRules(personalQueue.description);
  //                   }
  //                 }}
  //               >
  //                 {groups.map((g) => (
  //                   <option value={g._id} key={GenerateComponentKey(10)}>
  //                     {g.name}
  //                   </option>
  //                 ))}
  //               </select>
  //             </div>
  //             <div className="separator"></div>
  //             {!_queue.isGroup ? (
  //               <></>
  //             ) : (
  //               <>
  //                 <div className="option">
  //                   <p>Group name:</p>
  //                   <input
  //                     type="text"
  //                     defaultValue={_queue.name}
  //                     style={{
  //                       marginLeft: "5px",
  //                     }}
  //                     onBlur={(ev: any) => {
  //                       updateQueueOption("name", ev.target.value);
  //                     }}
  //                   />
  //                 </div>
  //                 <div className="option">
  //                   <p>Icon URL:</p>
  //                   <input
  //                     type="text"
  //                     defaultValue={_queue.icon}
  //                     style={{
  //                       marginLeft: "5px",
  //                     }}
  //                     onBlur={(ev: any) => {
  //                       updateQueueOption("icon", ev.target.value);
  //                     }}
  //                   />
  //                 </div>
  //                 <div className="option">
  //                   <p>Banner URL:</p>
  //                   <input
  //                     type="text"
  //                     defaultValue={_queue.banner}
  //                     style={{
  //                       marginLeft: "5px",
  //                     }}
  //                     onBlur={(ev: any) => {
  //                       updateQueueOption("banner", ev.target.value);
  //                     }}
  //                   />
  //                 </div>
  //                 <div className="separator"></div>
  //               </>
  //             )}
  //             <div className="option">
  //               <p>Open:</p>
  //               <Switch
  //                 defaultChecked={_queue.open}
  //                 onInput={(ev: any) => {
  //                   updateQueueOption("open", ev.target.checked);
  //                 }}
  //               ></Switch>
  //             </div>
  //             <div className="option">
  //               <p>Allow graveyard beatmaps:</p>
  //               <Switch
  //                 defaultChecked={_queue.allow.graveyard}
  //                 onInput={(ev: any) => {
  //                   updateQueueOption("allow", {
  //                     graveyard: ev.target.checked,
  //                     wip: _queue.allow.wip,
  //                     cross: _queue.allow.cross,
  //                   });
  //                 }}
  //               ></Switch>
  //             </div>
  //             <div className="option">
  //               <p>Allow wip beatmaps:</p>
  //               <Switch
  //                 defaultChecked={_queue.allow.wip}
  //                 onInput={(ev: any) => {
  //                   updateQueueOption("allow", {
  //                     wip: ev.target.checked,
  //                     graveyard: _queue.allow.graveyard,
  //                     cross: _queue.allow.cross,
  //                   });
  //                 }}
  //               ></Switch>
  //             </div>
  //             <div className="option">
  //               <p>Allow cross request:</p>
  //               <Switch
  //                 defaultChecked={_queue.allow.cross}
  //                 onInput={(ev: any) => {
  //                   updateQueueOption("allow", {
  //                     wip: _queue.allow.wip,
  //                     graveyard: _queue.allow.graveyard,
  //                     cross: ev.target.checked,
  //                   });
  //                 }}
  //               ></Switch>
  //             </div>
  //             <div className="separator"></div>
  //             <div className="option">
  //               <p>Max pending requests:</p>
  //               <input
  //                 type="number"
  //                 defaultValue={_queue.autoclose.size}
  //                 min={-1}
  //                 max={50}
  //                 style={{
  //                   marginLeft: "5px",
  //                 }}
  //                 onInput={(ev: any) => {
  //                   updateQueueOption("autoclose", {
  //                     enable: _queue.autoclose.enable,
  //                     size: Number(ev.target.value),
  //                   });
  //                 }}
  //               />
  //             </div>
  //             <div className="option">
  //               <p>Auto-Close after limit:</p>
  //               <Switch
  //                 defaultChecked={_queue.autoclose.enable}
  //                 onInput={(ev: any) => {
  //                   updateQueueOption("autoclose", {
  //                     enable: ev.target.checked,
  //                     size: _queue.autoclose.size,
  //                   });
  //                 }}
  //               />
  //             </div>
  //             <div className="separator"></div>
  //             {_queue.isGroup ? (
  //               <></>
  //             ) : (
  //               <>
  //                 <div className="option">
  //                   <p>Enable time-close:</p>
  //                   <Switch
  //                     defaultChecked={_queue.autoclose.enable}
  //                     onInput={(ev: any) => {
  //                       updateQueueOption("timeclose", {
  //                         enable: ev.target.checked,
  //                         size: _queue.timeclose.size,
  //                       });
  //                     }}
  //                   />
  //                 </div>
  //                 <div className="option">
  //                   <p>Close after (days):</p>
  //                   <input
  //                     type="number"
  //                     defaultValue={_queue.timeclose.size}
  //                     min={1}
  //                     max={31}
  //                     style={{
  //                       marginLeft: "5px",
  //                     }}
  //                     key={GenerateComponentKey(10)}
  //                     onInput={(ev: any) => {
  //                       _queue.timeclose.size = Number(ev.target.value);

  //                       updateQueueOption("autoclose", {
  //                         enable: _queue.timeclose.enable,
  //                         size: Number(ev.target.value),
  //                       });
  //                     }}
  //                   />
  //                 </div>
  //                 <div
  //                   className="row timerrow"
  //                   key={_queue.timeclose.scheduled}
  //                 >
  //                   <button className="custombutton" onClick={scheduleQueue}>
  //                     Start timer
  //                   </button>
  //                   {moment(_queue.timeclose.scheduled)
  //                     .add(_queue.timeclose.size, "days")
  //                     .toDate()
  //                     .valueOf() >= new Date().valueOf() ? (
  //                     <p>
  //                       Your queue will close{" "}
  //                       {moment(_queue.timeclose.scheduled)
  //                         .add(_queue.timeclose.size, "days")
  //                         .calendar()}{" "}
  //                       UTC
  //                     </p>
  //                   ) : (
  //                     <></>
  //                   )}
  //                 </div>
  //                 <div className="separator"></div>
  //               </>
  //             )}
  //             <div className="option  wide">
  //               <p>Preferences:</p>
  //               <TagsInput
  //                 key={GenerateComponentKey(10)}
  //                 value={_queue.genres}
  //                 onInput={(tags: string[]) => {
  //                   updateQueueOption("genres", tags);
  //                 }}
  //               ></TagsInput>
  //             </div>
  //             <div className="separator"></div>
  //             <div className="option wide modes">
  //               <p>Modes:</p>
  //               <div className="row modes">
  //                 <div>
  //                   osu!:{" "}
  //                   <Checkbox
  //                     key={GenerateComponentKey(10)}
  //                     defaultChecked={getQueueModes(0)}
  //                     onInput={(ev) => {
  //                       const target: any = ev.target;
  //                       setQueueModes(0, target.checked, _queue);
  //                     }}
  //                   ></Checkbox>
  //                 </div>
  //                 <div>
  //                   osu!taiko:{" "}
  //                   <Checkbox
  //                     key={GenerateComponentKey(10)}
  //                     defaultChecked={getQueueModes(1)}
  //                     onInput={(ev) => {
  //                       const target: any = ev.target;

  //                       setQueueModes(1, target.checked, _queue);
  //                     }}
  //                   ></Checkbox>
  //                 </div>
  //                 <div>
  //                   osu!catch:{" "}
  //                   <Checkbox
  //                     key={GenerateComponentKey(10)}
  //                     defaultChecked={getQueueModes(2)}
  //                     onInput={(ev) => {
  //                       const target: any = ev.target;

  //                       setQueueModes(2, target.checked, _queue);
  //                     }}
  //                   ></Checkbox>
  //                 </div>
  //                 <div>
  //                   osu!mania:{" "}
  //                   <Checkbox
  //                     key={GenerateComponentKey(10)}
  //                     defaultChecked={getQueueModes(3)}
  //                     onInput={(ev) => {
  //                       const target: any = ev.target;

  //                       setQueueModes(3, target.checked, _queue);
  //                     }}
  //                   ></Checkbox>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="separator"></div>
  //             <div className="option">
  //               <p>Webhook URL:</p>
  //               <input
  //                 type="text"
  //                 defaultValue={_queue.webhook ? _queue.webhook.url : ""}
  //                 style={{
  //                   marginLeft: "5px",
  //                 }}
  //                 key={GenerateComponentKey(10)}
  //                 onInput={(ev: any) => {
  //                   updateWebhookURL(ev.target.value, _queue);
  //                 }}
  //               />
  //               <button onClick={testWebhook} className="import">
  //                 Test
  //               </button>
  //               <button onClick={removeWebhook} className="import">
  //                 remove
  //               </button>
  //             </div>
  //             <div className="option wide modes">
  //               <p>Scopes:</p>
  //               <div className="row modes">
  //                 <div>
  //                   Request updates:{" "}
  //                   <Checkbox
  //                     defaultChecked={
  //                       _queue.webhook
  //                         ? _queue.webhook.notify.includes("request:update")
  //                         : false
  //                     }
  //                     onInput={(ev) => {
  //                       const target: any = ev.target;
  //                       setQueueWebhookTag(
  //                         "request:update",
  //                         target.checked,
  //                         _queue
  //                       );
  //                     }}
  //                   ></Checkbox>
  //                 </div>
  //                 <div>
  //                   New requests:{" "}
  //                   <Checkbox
  //                     defaultChecked={
  //                       _queue.webhook
  //                         ? _queue.webhook.notify.includes("request:new")
  //                         : false
  //                     }
  //                     onInput={(ev) => {
  //                       const target: any = ev.target;

  //                       setQueueWebhookTag(
  //                         "request:new",
  //                         target.checked,
  //                         _queue
  //                       );
  //                     }}
  //                   ></Checkbox>
  //                 </div>
  //                 <div>
  //                   Queue status:{" "}
  //                   <Checkbox
  //                     defaultChecked={
  //                       _queue.webhook
  //                         ? _queue.webhook.notify.includes("queue:state")
  //                         : false
  //                     }
  //                     onInput={(ev) => {
  //                       const target: any = ev.target;

  //                       setQueueWebhookTag(
  //                         "queue:state",
  //                         target.checked,
  //                         _queue
  //                       );
  //                     }}
  //                   ></Checkbox>
  //                 </div>
  //               </div>
  //             </div>
  //             {_queue.isGroup ? (
  //               <></>
  //             ) : (
  //               <>
  //                 <div className="separator"></div>
  //                 <div className="option">
  //                   <p>Import from another website:</p>
  //                   <button onClick={importFromOsumod} className="import">
  //                     Import from osumod
  //                   </button>
  //                 </div>
  //               </>
  //             )}
  //             <div className="separator"></div>
  //             {!_queue.isGroup ? (
  //               <></>
  //             ) : (
  //               <>
  //                 <div className="option  wide">
  //                   <p>Admins:</p>
  //                   <AdminInput
  //                     defaultValue={_queue.admins}
  //                     onInput={(admins) => {
  //                       updateQueueOption(
  //                         "admins",
  //                         admins.map((admin) => admin._id)
  //                       );
  //                     }}
  //                   ></AdminInput>
  //                   <button onClick={deleteQueue} className="import">
  //                     Delete Queue
  //                   </button>
  //                 </div>
  //                 <div className="separator"></div>
  //               </>
  //             )}

  //             <div className="option wide">
  //               <p>Rules:</p>
  //               <div className="wrapper">
  //                 <MDEditor
  //                   className="rulespreview"
  //                   value={queueRules || ""}
  //                   autoSave="true"
  //                   fullscreen={false}
  //                   extraCommands={[]}
  //                   textareaProps={{
  //                     onBlur: () => {
  //                       updateQueueOption("description", queueRules);
  //                     },
  //                   }}
  //                   onChange={(value: any) => {
  //                     setQueueRules(value);
  //                   }}
  //                 />
  //               </div>
  //             </div>
  //           </>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
};
