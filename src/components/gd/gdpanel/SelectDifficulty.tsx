import { useContext, useEffect, useState } from "react";
import { GDPanelContext } from "../../../providers/GDPanelContext";
import * as d3 from "d3";
import CatchIcon from "../../icons/CatchIcon";
import ManiaIcon from "../../icons/ManiaIcon";
import OsuIcon from "../../icons/OsuIcon";
import TaikoIcon from "../../icons/TaikoIcon";
import NoRequests from "../../global/NoRequests";
import GDSelector from "../GDSelector";
import { AuthContext } from "../../../providers/AuthContext";
import { useSnackbar } from "notistack";

interface ISelectDifficultyAtt {
  selectedDifficulty: number;
  setSelectedDifficulty: (_v: number) => any;
  setTab: (_v: number) => any;
}

export default ({
  selectedDifficulty,
  setSelectedDifficulty,
  setTab,
}: ISelectDifficultyAtt) => {
  const context = useContext(GDPanelContext);
  const { user, updateUser } = useContext(AuthContext);
  const [login, setLogin] = useState(JSON.parse(user));

  const icons = [OsuIcon, TaikoIcon, CatchIcon, ManiaIcon];

  const [request, setRequest] = useState({
    difficulty: "",
    comment: "",
  });

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

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const action = (key) => (
    <>
      <button
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        X
      </button>
    </>
  );

  function sendRequest() {
    fetch(`/api/gd/${context.gd._id}/claim`, {
      method: "POST",
      headers: {
        authorization: login.account_token,
        "content-type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((r) => r.json())
      .then((d) => {
        enqueueSnackbar(d.message, {
          variant: d.status == 200 ? "success" : "error",
          action,
        });
      });
  }

  return (
    <div className="difficultytab">
      <div className="left">
        {context.gd ? <GDSelector request={context.gd}></GDSelector> : <></>}
      </div>
      <div className="rightactions">
        <textarea
          className="comment"
          placeholder="Talk about why you want to claim this difficulty"
          onInput={(ev: any) => {
            request.comment = ev.target.value.trim();
            setRequest(request);
          }}
        ></textarea>
        <p className="subcategory">Available Difficulties</p>
        <div className="avaliabledifficulties customscroll">
          {!context.gd ? (
            <></>
          ) : (
            context.gd.difficulties.map((d, i) => {
              const Icon = icons[d.mode];

              return (
                <div
                  className={
                    selectedDifficulty == i
                      ? "difficultyselector selected"
                      : "difficultyselector"
                  }
                  onClick={() => {
                    setSelectedDifficulty(i);
                    setTab(1);

                    request.difficulty = d.id;
                    setRequest(request);
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
                </div>
              );
            })
          )}
        </div>
        <button onClick={sendRequest} className="savebutton">
          Send
        </button>
      </div>
    </div>
  );
};
