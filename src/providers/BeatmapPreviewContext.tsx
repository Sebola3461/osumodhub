import { createContext, useContext, useState } from "react";

export type BeatmapPreviewContextType = {
  paused: boolean;
  targetRequest: string;
  volume: number;
  position: number;
  setPosition: (_v: any) => void;
  setVolume: (_v: any) => void;
  setPause: (_v: any) => void;
  setTargetRequest: (_v: any) => void;
};

export const BeatmapPreviewContext = createContext<BeatmapPreviewContextType>({
  paused: true,
  targetRequest: "",
  volume: 0.5,
  position: 0,
  setPosition: (_v) => console.warn("Invalid action"),
  setVolume: (_v) => console.warn("Invalid action"),
  setPause: (_v) => console.warn("Invalid action"),
  setTargetRequest: (_v: any) => console.warn("sexo"),
});

export const BeatmapPreviewProvider = ({ children }: any) => {
  const [paused, setPause] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [position, setPosition] = useState(0);
  const [targetRequest, setTargetRequest] = useState("");

  return (
    <BeatmapPreviewContext.Provider
      value={{
        paused,
        volume,
        targetRequest,
        position,
        setPosition,
        setTargetRequest,
        setVolume,
        setPause,
      }}
    >
      {children}
    </BeatmapPreviewContext.Provider>
  );
};
