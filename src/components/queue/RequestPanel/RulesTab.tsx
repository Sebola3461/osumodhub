import Markdown from "markdown-to-jsx";
import { useContext } from "react";
import { RequestPanelContext } from "../../../providers/RequestPanelContext";

export default ({
  queue,
  setTab,
  request,
}: {
  queue: any;
  setTab: any;
  request: any;
}) => {
  const { open, setOpen, rulesRead, setRulesRead } =
    useContext(RequestPanelContext);

  return (
    <div className={"rulestab"}>
      <Markdown
        options={{
          disableParsingRawHTML: true,
        }}
      >
        {queue.description}
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
