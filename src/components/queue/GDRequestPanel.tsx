import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import GDPostSelector from "../gd/GDPostSelector";
import NoRequests from "../global/NoRequests";
import "./../../styles/GDRequestPanel.css";

export default () => {
  const { login, setLogin } = useContext(AuthContext);

  const [gds, setGds] = useState<any[] | undefined>();

  function getListing() {
    if (!gds) return <NoRequests />;

    return gds.map((gd) => <GDPostSelector request={gd} />);
  }

  useEffect(() => {
    fetch("/api/gd/posts", {
      headers: {
        authorization: login.account_token,
      },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status != 200) return;

        setGds(d.data.pending);
      });
  }, []);

  return (
    <div className="gdrequestpanel">
      <div className="container">
        <div className="paneltitle">
          <p className="title">Guest Difficulty</p>

          <div>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <div className="gdslisting">{getListing()}</div>
      </div>
    </div>
  );
};
