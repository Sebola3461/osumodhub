import React from "react";
import "./../../styles/SearchSelect.css";

export default ({
  label,
  options,
  onSelect,
}: {
  label: string;
  options: any;
  onSelect: Function;
}) => {
  return (
    <div className="searchselect background4 round1">
      <p>{label}:</p>
      <select
        onInput={(e) => {
          onSelect(e);
        }}
      >
        {options}
      </select>
    </div>
  );
};
