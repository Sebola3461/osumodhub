import "./../../styles/ProgressBar.css";

export default ({
  percent,
  min,
  max,
  onInput,
}: {
  percent: number;
  onInput: (...any) => any;
  min: number;
  max: number;
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
    </div>
  );
};
