export interface IQueue {
  _id: string;
  banner: string;
  name: string;
  open: boolean;
  icon: string;
  modes: number[];
  description: string;
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
  type: "modder" | "BN" | "NAT";
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
    scheduled: "";
    size: number;
  };
  twitter: string;
  discord: string;
  osu: string;
  cooldown: {
    enable: boolean;
    size: number;
  };
}
