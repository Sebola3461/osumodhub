import {
  faCheckCircle,
  faChevronCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import { AuthContext } from "../../providers/AuthContext";
import "./../../styles/LanguageSelector.scss";

export function LanguageSelector() {
  const user = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const list = [
    {
      title: "English",
      value: "enUS",
      flag: "us",
    },
    {
      title: "Bahasa Indonesia",
      value: "id",
      flag: "id",
    },
    {
      title: "Polski",
      value: "pl",
      flag: "pl",
    },
    {
      title: "Português",
      value: "ptBR",
      flag: "br",
    },
  ];

  function switchLanguage(to: string) {
    fetch("/api/users/language", {
      method: "POST",
      headers: {
        authorization: user.login.account_token,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        language: to,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status != 200) return;

        user.login.language = to;
        user.setLogin(JSON.parse(JSON.stringify(user.login)));
      });
  }

  function getCurrentLanguageData(code: string) {
    const l = list.find((lang) => lang.value == code);

    if (!l)
      return {
        title: "English",
        value: "enUS",
        flag: "us",
      };

    return l;
  }

  function switchOpen() {
    setOpen(!open);
  }

  return (
    <div className={open ? "language-selector open" : "language-selector"}>
      <div className="current" onClick={switchOpen}>
        <div
          className="flag"
          style={{
            backgroundImage: `url(https://flagcdn.com/${
              getCurrentLanguageData(user.login.language).flag
            }.svg)`,
          }}
        ></div>
        <p className="language">
          {getCurrentLanguageData(user.login.language).title}
        </p>
        <div className="icon">
          <FontAwesomeIcon icon={faChevronCircleUp} />
        </div>
      </div>
      <div className="list">
        {list.map((l) => (
          <div
            className="language-option"
            onClick={() => {
              switchLanguage(l.value);
            }}
          >
            {user.login.language == l.value ? (
              <div className="icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            ) : null}
            <div
              className="language-flag"
              key={GenerateComponentKey(10)}
              style={{
                backgroundImage: `url(https://flagcdn.com/${l.flag}.svg)`,
              }}
            ></div>
            {l.title}
          </div>
        ))}
      </div>
    </div>
  );
}
