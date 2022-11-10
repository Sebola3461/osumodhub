import Markdown from "markdown-to-jsx";
import { useContext } from "react";
import {
  getDictionary,
  getLocalization,
} from "../../../localization/localizationManager";
import { AuthContext } from "../../../providers/AuthContext";
import { QueueContext } from "../../../providers/QueueContext";
import { RequestPanelContext } from "../../../providers/RequestPanelContext";

export default ({ setTab, request }: { setTab: any; request: any }) => {
  const { open, setOpen, rulesRead, setRulesRead } =
    useContext(RequestPanelContext);
  const { login } = useContext(AuthContext);

  const queueContext = useContext(QueueContext);

  return (
    <div className={"rulestab"}>
      <Markdown
        options={{
          disableParsingRawHTML: true,
        }}
      >
        {queueContext.data.description}
      </Markdown>
      <button
        onClick={() => {
          setRulesRead(true);

          if (request.beatmap.id == -1 || !request.beatmap.id) return setTab(0);

          setTab(2);
        }}
      >
        {getDictionary(login.language).requestPanel.rules.confirm}
      </button>
    </div>
  );
};
