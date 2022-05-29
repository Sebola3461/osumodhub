import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StartAuthentication from "../../helpers/StartAuthentication";
import { AuthContext } from "../../providers/AuthContext";
import "./../../styles/AppBar.css";

export default () => {
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));

  useEffect(() => {
    setLogin(JSON.parse(user));
  }, [user]);

  return (
    <div id="appbar" className="background2">
      <div className="logo"></div>
      <div className="links-row">
        <Link to="/" className="anchor1 page-anchor">
          Home
        </Link>
        <Link to="/" className="anchor1 page-anchor">
          Discord
        </Link>
      </div>
      <div className="right-content">
        <div
          className="avatar"
          onClick={StartAuthentication}
          style={{
            backgroundImage: `url(https://a.ppy.sh/${login._id})`,
          }}
        ></div>
      </div>
    </div>
  );
};
