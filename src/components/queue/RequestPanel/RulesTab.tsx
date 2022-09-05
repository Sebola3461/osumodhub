import Markdown from "markdown-to-jsx";
import { useContext } from "react";
import { QueueContext } from "../../../providers/QueueContext";
import { RequestPanelContext } from "../../../providers/RequestPanelContext";

export default ({ setTab, request }: { setTab: any; request: any }) => {
  const { open, setOpen, rulesRead, setRulesRead } =
    useContext(RequestPanelContext);

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
        I read the rules
      </button>
    </div>
  );
};
