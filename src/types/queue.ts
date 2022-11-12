export interface IQueue {
  _id: string;
  owner: string;
  banner: string;
  name: string;
  open: boolean;
  icon: string;
  modes: number[];
  description: string;
  admins: string[];
  isGroup: boolean;
  color: string;
  lastSeen: Date;
  /**
   * pending
   * accepted
   * rejected
   * waiting another bn
   * recheck
   * finished
   * nominated
   * archived
   */
  statistics: {
    0: 0;
    1: 0;
    2: 0;
    3: 0;
    4: 0;
    5: 0;
    6: 0;
    7: 0;
  };
  verified: {
    type: Boolean;
    default: false;
  };
  tags: any[];
  type: "modder" | "BN" | "NAT" | "group";
  country: {
    acronym: string;
    name: string;
    flag: string;
  };
  allow: {
    graveyard: boolean;
    wip: boolean;
    cross: boolean;
  };
  genres: string[];
  followers: any[];
  autoclose: {
    enable: boolean;
    size: number;
  };
  timeclose: {
    enable: boolean;
    scheduled: Date | string;
    size: number;
    validated: boolean;
  };
  twitter: string;
  discord: string;
  osu: string;
  cooldown: {
    enable: boolean;
    size: number;
  };
  webhook: {
    url: string;
    notify: string[];
  };
}

export interface IQueueRequestManager {
  status: string;
  feedback: string;
  username: string;
  userId: string;
}

export interface IQueueGDRequestDifficulty {
  id: string;
  name: string;
  starRating: number;
  claimed: boolean;
  mode: number;
  user: {
    name: string | null;
    id: string | null;
  };
}

export interface IQueueRequest {
  _id: string;
  _queue: string;
  _owner: string;
  _owner_name: string;
  comment: string | null;
  reply: string;
  beatmapset_id: number;
  beatmap: IStaticBeatmapset;
  status: string;
  date: Date;
  cross: boolean;
  isWs?: boolean; // ? true if the request is handled by websocket
  isWsNew?: boolean; // ? true if the request is handled by websocket (but only new requests)
  _managed_by: string;
  _manager_username: string;
  _managers: IQueueRequestManager[];
  isGd: boolean | undefined;
  difficulties: IQueueGDRequestDifficulty[];
  subscribed: boolean;
  __v: 0;
}

export interface IStaticBeatmapset {
  id: number;
  artist: string;
  title: string;
  covers: {
    cover: string;
    "cover@2x": string;
    card: string;
    "card@2x": string;
    list: string;
    "list@2x": string;
    slimcover: string;
    "slimcover@2x": string;
  };
  bpm: number;
  duration: number;
  creator: string;
  beatmaps: IStaticBeatmapDifficulty[];
}

export interface IStaticBeatmapDifficulty {
  version: string;
  difficulty_rating: number;
  user_id: number;
  mode: "osu" | "taiko" | "fruits" | "mania";
}
