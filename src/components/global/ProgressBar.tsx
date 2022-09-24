import "./../../styles/ProgressBar.css";

export default ({ percent }: { percent: number }) => {
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
      <p>{percent}%</p>
    </div>
  );
};
