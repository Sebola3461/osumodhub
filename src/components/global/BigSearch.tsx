import "./../../styles/BigSearch.css";

export default ({ onInput }: { onInput: Function }) => {
  return (
    <div className="bigsearch background5 round1">
      <input
        type="text"
        placeholder="Peppy with neko ears"
        onKeyDown={(e) => {
          onInput(e);
        }}
      />
    </div>
  );
};
