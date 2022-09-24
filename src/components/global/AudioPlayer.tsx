import {
  faPause,
  faPlay,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Slider } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import { BeatmapPreviewContext } from "../../providers/BeatmapPreviewContext";
import { QueueContext } from "../../providers/QueueContext";
import { IQueueRequest } from "../../types/queue";
import "./../../styles/AudioPlayer.css";
import ProgressBar from "./ProgressBar";
import SeekBar from "./SeekBar";

function getVolume() {
  const volume = localStorage.player_volume;

  if (!volume) return 0.5;

  return Number(volume);
}

function setVolume(value: number) {
  localStorage.player_volume = String(value);
}

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

    if (audioPlayer.current.currentTime < 0.05) {
      setVisible(false);
    }
  };

  useEffect(() => {
    audioPlayer.current.src = `https://b.ppy.sh/preview/${beatmapId}.mp3`;
    audioPlayer.current.volume = getVolume();

    if (!context.paused) {
      audioPlayer.current.play();
    }
  }, [beatmapId]);

  useEffect(() => {
    if (!requests) return;

    const r = requests.find((r) => r._id == context.targetRequest);

    setBeatmapId(r ? r.beatmapset_id : -1);

    audioPlayer.current.volume = getVolume();

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

  function getBanner() {
    const r = requests.find((r) => r._id == context.targetRequest);

    if (!r) return "";

    return r.beatmap.covers["slimcover@2x"];
  }

  return (
    <>
      <div
        className={visible ? "audioplayer visible" : "audioplayer"}
        onMouseOver={() => {
          setMouse(true);
        }}
      >
        <div
          className="banner"
          style={{
            backgroundImage: `url(${getBanner()})`,
          }}
        ></div>
        <div className="container">
          <div className="controls" onClick={context.paused ? play : pause}>
            <FontAwesomeIcon icon={context.paused ? faPlay : faPause} />
          </div>
          <Slider
            min={0}
            max={10}
            onChange={(ev: any) => {
              audioPlayer.current.currentTime = Number(ev.target.value);
            }}
            value={audioPlayer.current.currentTime}
            className="seekbar"
          />
          <div className="seeknumber">
            <p className="white">
              0:{audioPlayer.current.currentTime.toFixed(0)}
            </p>
            <p className="grey">
              <span>/</span>0:10
            </p>
          </div>
          <div className="volume">
            <Slider
              min={0}
              max={1}
              step={0.025}
              className="volumebar"
              orientation="vertical"
              defaultValue={getVolume()}
              onChange={(ev: any) => {
                audioPlayer.current.volume = Number(ev.target.value);
                setVolume(ev.target.value);
              }}
            />
            <FontAwesomeIcon icon={faVolumeHigh} />
          </div>
        </div>
      </div>
    </>
  );
};
