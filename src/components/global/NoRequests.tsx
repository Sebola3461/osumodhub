import React from "react";
import "./../../styles/NoRequests.css";

export default ({ text }: { text?: string }) => {
  return (
    <div className="norequests background4 round1">
      <p className="big">{text || "No requests yet..."}</p>
    </div>
  );
};
