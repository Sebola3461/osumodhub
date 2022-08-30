import Markdown from "markdown-to-jsx";
import { useContext, useEffect, useState } from "react";
import { ConfirmDialogContext } from "../../providers/ConfirmDialogContext";
import "./../../styles/ConfirmDialog.css";

export default () => {
  const context = useContext(ConfirmDialogContext);
  const [textValue, setTextValue] = useState(context.data.defaultValue || "");

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
        {context.type == 0 ? (
          <></>
        ) : (
          <textarea
            defaultValue={context.data.defaultValue}
            onInput={(v: any) => {
              setTextValue(v.target.value);
            }}
          ></textarea>
        )}
        <div className="actions">
          <button
            onClick={() => {
              context.action(textValue);
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
