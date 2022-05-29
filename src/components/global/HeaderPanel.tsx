import React from "react";
import "./../../styles/HeaderPanel.css";

export default ({ children, style }: any) => {
  return (
    <div className="ui-panel background2 round2" style={style || ""}>
      {children}
    </div>
  );
};
