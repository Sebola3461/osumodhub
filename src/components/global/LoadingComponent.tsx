export default ({ text }: { text?: string }) => {
  return (
    <div className="loadingcontainer">
      <div className="patchouli"></div>
      <p>{text || "Loading..."}</p>
    </div>
  );
};
