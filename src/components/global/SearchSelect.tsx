import React from "react";
import "./../../styles/SearchSelect.css";

export default ({
  label,
  options,
  onSelect,
  icon,
  _default,
}: {
  icon?: any;
  label: string;
  options: any;
  onSelect: Function;
  _default?: any;
}) => {
  return (
    <div className="searchselect background4 round1">
      {<div className="icon">{icon}</div>}
      <p>{label}:</p>
      <select
        onInput={(e) => {
          onSelect(e);
        }}
        defaultValue={_default}
      >
        {options}
      </select>
    </div>
  );
};
