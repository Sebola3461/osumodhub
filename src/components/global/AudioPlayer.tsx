import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BeatmapPreviewContext } from "../../providers/BeatmapPreviewContext";
import { QueueContext } from "../../providers/QueueContext";
import { IQueueRequest } from "../../types/queue";
import "./../../styles/AudioPlayer.css";

export default () => {
  const audioPlayer = useRef(new Audio());
  const [beatmapId, setBeatmapId] = useState(-1);
  const context = useContext(BeatmapPreviewContext);
  const { requests } = useContext(QueueContext);
  const [visible, setVisible] = useState(false);
  const [mouse, setMouse] = useState(false);

  const play = () => {
    context.setPause(false);
  };

  const pause = () => {
    context.setPause(true);
  };

  audioPlayer.current.onplay = () => {
    setVisible(true);
  };

  audioPlayer.current.onended = () => {
    context.setPause(true);
    context.setPosition(0);
    setVisible(false);
  };

  audioPlayer.current.ontimeupdate = (s: any) => {
    context.setPosition(
      (audioPlayer.current.currentTime / audioPlayer.current.duration) * 100
    );
  };

  useEffect(() => {
    audioPlayer.current.src = `https://b.ppy.sh/preview/${beatmapId}.mp3`;

    if (!context.paused) {
      audioPlayer.current.play();
    }
  }, [beatmapId]);

  useEffect(() => {
    if (!requests) return;

    const r = requests.find((r) => r._id == context.targetRequest);
    audioPlayer.current.volume = 0.05;

    setBeatmapId(r ? r.beatmapset_id : -1);

    if (context.paused) {
      audioPlayer.current.pause();
      return;
    }

    if (!context.paused) {
      audioPlayer.current.play();
      return;
    }
  }, [context]);

  const position: any = {
    "--bg": `linear-gradient(90deg, #e87110 ${
      isNaN(context.position) ? 0 : context.position
    }%, var(--background4) ${isNaN(context.position) ? 0 : context.position}%)`,
  };

  if (!requests) return <></>;

  return (
    <>
      <div
        className={visible ? "audioplayer visible" : "audioplayer"}
        onMouseOver={() => {
          setMouse(true);
        }}
      >
        <div className="controls" onClick={context.paused ? play : pause}>
          <FontAwesomeIcon icon={context.paused ? faPlay : faPause} />
        </div>
        <div style={position} className="position"></div>
      </div>
    </>
  );
};
