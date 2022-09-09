import { useContext } from "react";
import { QueueContext } from "../../providers/QueueContext";

import "./../../styles/QueueStatistics.css";

export default () => {
  const queue = useContext(QueueContext);

  if (!queue.requests) return <></>;

  const processedRequests = queue.requests.filter((r) =>
    ["finished", "nominated", "ranked"].includes(r.status)
  );

  return (
    <div className="queuestatistics">
      <div className="_category">
        <p className="label">Modding progress:</p>
        <div className="slider">
          <div
            className="slidercontent"
            style={{
              width: `${
                (processedRequests.length / queue.requests.length) * 100
              }%`,
            }}
          ></div>
        </div>
        <span>{`${(
          (processedRequests.length / queue.requests.length) *
          100
        ).toFixed(0)}%`}</span>
      </div>
    </div>
  );
};
