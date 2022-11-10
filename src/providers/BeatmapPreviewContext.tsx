import {
  createContext,
  useContext,
  useState,
  MutableRefObject,
  useRef,
} from "react";
import { IStaticBeatmapset } from "../types/queue";

export type BeatmapPreviewContextType = {
  paused: boolean;
  targetRequest: string;
  audio: MutableRefObject<HTMLAudioElement>;
  volume: number;
  position: number;
  map: IStaticBeatmapset;
  setPosition: (_v: any) => void;
  setVolume: (_v: any) => void;
  setPause: (_v: any) => void;
  setTargetRequest: (_v: any) => void;
  setMap: (_v: any) => void;
};

export const BeatmapPreviewContext = createContext<BeatmapPreviewContextType>({
  paused: true,
  targetRequest: "",
  volume: 0.05,
  position: 0,
  audio: null,
  map: null,
  setPosition: (_v) => console.warn("Invalid action"),
  setVolume: (_v) => console.warn("Invalid action"),
  setPause: (_v) => console.warn("Invalid action"),
  setTargetRequest: (_v: any) => console.warn("sexo"),
  setMap: (_v: any) => console.warn("sexo"),
});

export const BeatmapPreviewProvider = ({ children }: any) => {
  const [paused, setPause] = useState(true);
  const [volume, setVolume] = useState(0.05);
  const [position, setPosition] = useState(0);
  const [map, setMap] = useState(null);
  const [targetRequest, setTargetRequest] = useState("");
  const audio = useRef(new Audio());

  return (
    <BeatmapPreviewContext.Provider
      value={{
        paused,
        volume,
        targetRequest,
        position,
        audio,
        setPosition,
        setTargetRequest,
        setVolume,
        setPause,
        map,
        setMap,
      }}
    >
      {children}
    </BeatmapPreviewContext.Provider>
  );
};
