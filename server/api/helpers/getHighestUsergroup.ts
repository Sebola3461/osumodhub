import { User, UserGroup } from "./../../../src/types/user";

export default function parseUsergroup(mapper: User) {
  const userGroupInfo: any = {
    PPY: {
      index: 0,
      name: "Bald",
      icon: "https://media.discordapp.net/attachments/950107895754784908/953774037790769182/dev.png",
    },
    SPT: {
      index: 1,
      name: "Support Team",
      icon: "https://media.discordapp.net/attachments/950107895754784908/953775607395807242/spt.png",
    },
    DEV: {
      index: 2,
      name: "Developer",
      icon: "https://media.discordapp.net/attachments/950107895754784908/953774037790769182/dev.png",
    },
    GMT: {
      index: 3,
      name: "Global Moderator",
      icon: "https://media.discordapp.net/attachments/941102492857557023/948649173396361226/gmt.png",
    },
    NAT: {
      index: 4,
      name: "Nomination Assessment Team",
      icon: "https://media.discordapp.net/attachments/941102492857557023/948649173794832414/nat2.png",
    },
    BN: {
      index: 5,
      name: "Beatmap Nominator",
      icon: "https://media.discordapp.net/attachments/941102492857557023/948649173199249438/bn2.png",
    },
    ALM: {
      index: 6,
      name: "Alumni",
      icon: "https://media.discordapp.net/attachments/941102492857557023/948649174197489694/alm.png",
    },
    LVD: {
      index: 7,
      name: "Project Loved",
      icon: "https://media.discordapp.net/attachments/941102492857557023/948649173576740915/lvd.png",
    },
    BOT: {
      index: 8,
      name: "BOT",
      colour: "#ffffff",
      icon: "https://media.discordapp.net/attachments/865037717590245436/955965426964258906/bot.png",
    },
  };

  const usergroups = mapper.groups;

  console.log(usergroups);

  if (!usergroups) return "modder";

  let groups = new Array(usergroups?.length);

  // ? Sort usergroups
  usergroups?.forEach((g) => {
    const index = userGroupInfo[g.short_name].index;
    groups[index] = g;
    groups[index].index = index;
    groups[index].icon = userGroupInfo[g.short_name].icon;
  });

  if (!groups) return "mapper";

  console.log(groups);

  if (groups.length > 0) {
    groups.sort((a, b) => {
      return a - b;
    });

    console.log(groups);

    let group = groups[0];

    if (["nat", "bn"].includes(group.short_name.toLowerCase()))
      return group.short_name;
  } else {
    return "mapper";
  }
}
