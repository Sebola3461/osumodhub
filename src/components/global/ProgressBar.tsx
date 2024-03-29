import "./../../styles/ProgressBar.css";

export default ({
  percent,
  displayPercent,
}: {
  percent: number;
  displayPercent?: boolean;
}) => {
  return (
    <div className="progressbar">
      <div className="background">
        <div
          className="progressbar-content"
          style={{
            width: `${percent}%`,
          }}
        ></div>
      </div>
      {displayPercent ? <p>{percent}%</p> : <></>}
    </div>
  );
};
