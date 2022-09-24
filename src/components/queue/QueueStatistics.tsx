import { useContext } from "react";
import { QueueContext } from "../../providers/QueueContext";
import ProgressBar from "../global/ProgressBar";

import "./../../styles/QueueStatistics.css";

export default () => {
  const queue = useContext(QueueContext);

  if (!queue.requests) return <></>;

  const processedRequests = queue.requests.filter((r) =>
    ["finished", "nominated", "ranked"].includes(r.status)
  );

  return (
    <div className="queuestatistics">
      <p className="statisticstitle">
        Statistics
        <span></span>
      </p>
      <div className="_category">
        <p className="label">Modding progress</p>
        <ProgressBar percent={50} />
      </div>
      <div className="_category">
        <p className="label">Acceptance Rate</p>
        <ProgressBar percent={50} />
      </div>
    </div>
  );
};
