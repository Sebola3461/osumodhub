import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import "./../../styles/Tag.css";

export default ({
  content,
  style,
  type,
  icon,
}: {
  content: string;
  style?: any;
  type?: string;
  icon?: any;
}) => {
  return (
    <div
      className={`tag ${type || ""}`}
      style={style || {}}
      key={GenerateComponentKey(20)}
    >
      {content}
      {icon}
    </div>
  );
};
