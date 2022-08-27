import { useEffect } from "react";
import { GenerateComponentKey } from "../../../helpers/GenerateComponentKey";
import NoRequests from "../../global/NoRequests";
import * as d3 from "d3";
import { IGDRequest } from "../GDSelector";
import { Icon } from "@mui/material";
import CatchIcon from "../../icons/CatchIcon";
import ManiaIcon from "../../icons/ManiaIcon";
import OsuIcon from "../../icons/OsuIcon";
import TaikoIcon from "../../icons/TaikoIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dirname } from "path";
import Tag from "../../global/Tag";

export default ({
  requests,
  selectedPost,
  setSelectedPost,
  selectedRequest,
  setSelectedRequest,
  setTab,
  claimRequests,
  setClaimRequests,
  setSelectedPostData,
  selectedPostData,
  selectedDifficulty,
  setSelectedDifficulty,
}: {
  requests: {
    pending: IGDRequest[];
    other: IGDRequest[];
  };
  selectedPost: string | undefined;
  setSelectedPost: (v: string) => any;
  selectedRequest: any;
  setSelectedRequest: (v: string) => any;
  setTab: (v: number) => any;
  claimRequests: any;
  setClaimRequests: any;
  setSelectedPostData: (d: any) => any;
  selectedPostData: any;
  setSelectedDifficulty: (d: any) => any;
  selectedDifficulty: any;
}) => {
  useEffect(() => {
    fetch(`/api/gd/${selectedPost}/claim`)
      .then((r) => r.json())
      .then((d) => {
        setClaimRequests(d.data);
      });
  }, [selectedPost]);

  useEffect(() => {}, [selectedRequest]);

  let hasSelectedPost = claimRequests.find((r) => r._id == selectedRequest);

  const statusText = {
    waiting: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  const statusColor = {
    waiting: "--darkorange",
    accepted: "--green",
    rejected: "--red",
  };

  const icons = [OsuIcon, TaikoIcon, CatchIcon, ManiaIcon];

  const difficultyColourSpectrum = d3
    .scaleLinear<string>()
    .domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
    .clamp(true)
    .range([
      "#4290FB",
      "#4FC0FF",
      "#4FFFD5",
      "#7CFF4F",
      "#F6F05C",
      "#FF8068",
      "#FF4E6F",
      "#C645B8",
      "#6563DE",
      "#18158E",
      "#000000",
    ])
    .interpolate(d3.interpolateRgb.gamma(2.2));

  return (
    <div className="claimrequesttab customscroll">
      <div className="listcategory">
        <div className="listing customscroll">
          {selectedPostData.difficulties.length == 0 ? (
            <NoRequests text="Loading difficulties..."></NoRequests>
          ) : (
            selectedPostData.difficulties.map((d) => {
              if (!d.name || JSON.stringify(d) == "{}" || !claimRequests)
                return <></>;

              const Icon = icons[d.mode];

              console.log(claimRequests.filter((r) => r.difficulty == d.id));

              const claimRequestsForThisDifficulty = claimRequests.filter(
                (r) => r.difficulty == d.id
              );

              return (
                <div
                  className={
                    selectedDifficulty == d.id
                      ? "difficultyselector selected"
                      : "difficultyselector"
                  }
                  onClick={() => {
                    setSelectedDifficulty(d.id);
                    setTab(2);
                  }}
                >
                  <Icon
                    width="30px"
                    height="30px"
                    color={difficultyColourSpectrum(d.max_sr)}
                  />
                  <div className="metadata">
                    <p className="name">{d.name}</p>
                  </div>
                  {claimRequestsForThisDifficulty.length > 0 ? (
                    <Tag
                      content={`${claimRequestsForThisDifficulty.length} Claim Requests`}
                    ></Tag>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
