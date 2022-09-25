import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties, useContext } from "react";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import { ConfirmDialogContext } from "../../providers/ConfirmDialogContext";
import "./../../styles/HelpCircle.css";

export default ({
  content,
  title,
  style,
}: {
  content: string;
  title: string;
  style?: CSSProperties;
}) => {
  const dialog = useContext(ConfirmDialogContext);

  function setup() {
    dialog.setConfirm();
    dialog.setData({
      title: title,
      text: content,
    });
    dialog.setAction(() => {});
    dialog.setDisplayCancel(false);
    dialog.setOpen(true);
  }

  return (
    <div
      className={`help-circle`}
      style={style || {}}
      key={GenerateComponentKey(20)}
      onClick={setup}
    >
      <FontAwesomeIcon icon={faQuestionCircle} />
    </div>
  );
};
