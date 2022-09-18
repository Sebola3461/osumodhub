import {
  createContext,
  useContext,
  useState,
  MutableRefObject,
  useRef,
} from "react";

export type BeatmapPreviewContextType = {
  paused: boolean;
  targetRequest: string;
  audio: MutableRefObject<HTMLAudioElement>;
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
  volume: 0.05,
  position: 0,
  audio: null,
  setPosition: (_v) => console.warn("Invalid action"),
  setVolume: (_v) => console.warn("Invalid action"),
  setPause: (_v) => console.warn("Invalid action"),
  setTargetRequest: (_v: any) => console.warn("sexo"),
});

export const BeatmapPreviewProvider = ({ children }: any) => {
  const [paused, setPause] = useState(true);
  const [volume, setVolume] = useState(0.05);
  const [position, setPosition] = useState(0);
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
      }}
    >
      {children}
    </BeatmapPreviewContext.Provider>
  );
};
