import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StartAuthentication from "../../helpers/StartAuthentication";
import { AuthContext } from "../../providers/AuthContext";
import { SideMenuContext } from "../../providers/UserSideMenu";
import "./../../styles/AppBar.css";

export default () => {
  const { user, updateUser } = useContext(AuthContext);
  const sideMenuContext = useContext(SideMenuContext);
  const [login, setLogin] = useState(JSON.parse(user));

  useEffect(() => {
    setLogin(JSON.parse(user));
  }, [user]);

  useEffect(() => {
    sideMenuContext.setOpen(true);
    console.log(sideMenuContext.open);
  }, []);

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
          onClick={() => {
            login._id == -1
              ? StartAuthentication
              : sideMenuContext.setOpen(!sideMenuContext.open);
          }}
          style={{
            backgroundImage: `url(https://a.ppy.sh/${login._id})`,
          }}
        ></div>
      </div>
    </div>
  );
};
