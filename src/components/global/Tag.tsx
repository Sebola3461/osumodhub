import "./../../styles/Tag.css";

export default ({
  content,
  style,
  type,
}: {
  content: string;
  style?: any;
  type?: string;
}) => {
  return (
    <div className={`tag ${type || ""}`} style={style || {}}>
      {content}
    </div>
  );
};
