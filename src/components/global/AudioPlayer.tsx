import React, { useContext, useRef, useState } from "react";
import { BeatmapPreviewContext } from "../../providers/BeatmapPreviewContext";

export default () => {
  const audioPlayer = useRef(new Audio());
  const [currentTime, setCurrentTime] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const context = useContext(BeatmapPreviewContext);

  const play = () => {
    audioPlayer.current.play();
  };

  const pause = () => {
    audioPlayer.current.pause();
  };

  const stop = () => {
    audioPlayer.current.pause();
    audioPlayer.current.currentTime = 0;
  };

  const setSpeed = (speed) => {
    audioPlayer.current.playbackRate = speed;
  };

  const onPlaying = () => {
    setCurrentTime(audioPlayer.current.currentTime);
    setSeekValue(
      (audioPlayer.current.currentTime / audioPlayer.current.duration) * 100
    );
  };

  return (
    <>
      <audio
        src={`https://b.ppy.sh/preview/${context.targetRequest}.mp3`}
        ref={audioPlayer}
        onTimeUpdate={onPlaying}
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      <br />
      <p>{currentTime}</p>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={seekValue}
        onChange={(e: any) => {
          const seekto = audioPlayer.current.duration * (+e.target.value / 100);
          audioPlayer.current.currentTime = seekto;
          setSeekValue(e.target.value);
        }}
      />
      <div>
        <button onClick={play}>play</button>
        <button onClick={pause}>pause</button>
        <button onClick={stop}>stop</button>
        <button onClick={() => setSpeed(0.5)}>0.5x</button>
        <button onClick={() => setSpeed(1)}>1x</button>
        <button onClick={() => setSpeed(1.5)}>1.5x</button>
        <button onClick={() => setSpeed(2)}>2x</button>
      </div>
    </>
  );
};
