import Markdown from "markdown-to-jsx";
import { useContext } from "react";
import { ConfirmDialogContext } from "../../providers/ConfirmDialogContext";
import "./../../styles/ConfirmDialog.css";

export default () => {
  const context = useContext(ConfirmDialogContext);

  function closeDialog() {
    context.setOpen(false);
  }

  function auxCloseDialog(ev: any) {
    if (ev.target.className != "confirmdialog open") return;

    closeDialog();

    return;
  }

  function escCloseDialog(ev: any) {
    if (ev.target.className != "confirmdialog open") return;
    if (ev.key != "escape") return;

    closeDialog();

    return;
  }

  return (
    <div
      className={context.open ? "confirmdialog open" : "confirmdialog"}
      onKeyDown={escCloseDialog}
      onClick={auxCloseDialog}
    >
      <div className="container">
        <div className="title">{context.data.title}</div>
        <div className="text">
          <Markdown>{context.data.text}</Markdown>
        </div>
        <div className="actions">
          <button
            onClick={() => {
              context.action();
              context.setOpen(false);
            }}
          >
            Ok
          </button>
          {context.displayCancel ? (
            <button onClick={closeDialog}>Cancel</button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
