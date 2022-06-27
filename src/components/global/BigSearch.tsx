import "./../../styles/BigSearch.css";

export default ({
  onInput,
  _default,
}: {
  onInput: Function;
  _default: any;
}) => {
  return (
    <div className="bigsearch background5 round1">
      <input
        type="text"
        placeholder="Peppy with neko ears"
        defaultValue={_default}
        onInput={(e) => {
          onInput(e);
        }}
      />
    </div>
  );
};
