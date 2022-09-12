import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import "./../../styles/AdminInput.css";

export default ({
  onInput,
  defaultValue,
}: {
  onInput?: any;
  defaultValue?: any[];
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [result, setResult] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetch("/api/users/groups/admins")
      .then((r) => r.json())
      .then((d) => {
        if (d.status != 200) return;

        setAllUsers(d.data);

        if (defaultValue) {
          setAdmins(
            JSON.parse(
              JSON.stringify(
                d.data.filter((admin) => defaultValue.includes(admin._id))
              )
            )
          );
        }
      });
  }, []);

  function filter(ev: any) {
    const text = ev.target.value.trim().toLowerCase();

    if (text.length == 0) return setResult([]);

    const staticResult = allUsers
      .filter((u) => u.username.toLowerCase().includes(text))
      .sort(function (a, b) {
        if (a.username < b.username) {
          return -1;
        }
        if (a.username > b.username) {
          return 1;
        }
        return 0;
      });

    staticResult.splice(3, 99999);
    setResult(staticResult);
  }

  function addAdmin(a) {
    if (admins.find((admin) => admin._id == a._id)) return;

    admins.push(a);
    setAdmins(JSON.parse(JSON.stringify(admins)));

    onInput(admins);
  }

  function removeAdmin(i) {
    if (!admins[i]) return;

    admins.splice(i, 1);
    setAdmins(JSON.parse(JSON.stringify(admins)));

    onInput(admins);
  }

  return (
    <div className="admininput">
      <div
        className={admins.length == 0 ? "" : "admins"}
        key={GenerateComponentKey(10)}
      >
        {admins.map((a, i) => (
          <div className="admin">
            {a.username}
            <div
              className="remove"
              onClick={() => {
                removeAdmin(i);
              }}
            >
              <FontAwesomeIcon icon={faTimesCircle} />
            </div>
          </div>
        ))}
      </div>
      <input type="string" onChange={filter} placeholder="type an username" />
      <div className={result.length > 0 ? "results" : ""}>
        {result.map((u, i) => (
          <div
            className="user"
            onClick={() => {
              addAdmin(u);
            }}
            onKeyDown={() => {
              addAdmin(u);
            }}
            tabIndex={i}
          >
            <div
              className="pfp"
              style={{
                backgroundImage: `url(https://a.ppy.sh/${u._id})`,
              }}
            ></div>
            <p className="name">{u.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
