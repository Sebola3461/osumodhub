export default {
  flag: "https://flagcdn.com/us.svg",
  navbar: {
    queues: "Queues",
  },
  home: {
    search: {
      title: "Search",
      placeholder: "Genres, usernames or mapping styles",
      categories: {
        labels: {
          type: "Type",
          status: "Status",
          mode: "Mode",
          sort: "Sort by",
        },
        selects: {
          type: {
            any: "All",
            nominators: "Nominators",
            modders: "Modders",
            groups: "Groups",
          },
          mode: {
            any: "All",
          },
          status: {
            any: "All",
            open: "Open",
            closed: "Closed",
          },
          sort: {
            any: "All",
            activity: "Activity",
            nameTop: "Name (A-Z)",
            nameBottom: "Name (Z-A)",
          },
        },
      },
    },
  },
  userSideMenu: {
    title: "Hello, $username!",
    options: {
      personalQueue: "My queue",
      createQueue: "Create a queue",
      settings: "Settings",
      requests: "My requests",
      groups: "My groups",
      logout: "Log-out",
    },
  },
  requestPanel: {
    title: "Request beatmap",
    tabs: {
      beatmaps: "beatmaps",
      rules: "rules",
      request: "request",
    },
    input: {
      placeholder: "Paste beatmap url here",
      button: "Fetch",
      invalid: "This isn't an osu! beatmap url!",
    },
    rules: {
      agreeWithRules: "You must read the rules before request!",
      confirm: "I read the rules",
    },
    request: {
      commentTitle: "Comment",
      confirm: "Request",
    },
  },
  notificationsSideMenu: {
    title: "Notifications",
    clearNotifications: "Clear all notifications",
    clearInbox: "Nothing here...",
    markAsRead: "Mark as read",
  },
  manageRequestPanel: {
    title: "Manage request",
    requesterTag: "requester",
    groupOwnerTag: "owner",
    groupManagerTag: "manager",
    tabs: {
      discussion: "Discussion",
      manage: "Manage",
    },
    manageTab: {
      feedbackTitle: "Feedback",
      placeholder: "Optional",
    },
  },
  requests: {
    status: {
      any: "All",
      pending: "Pending",
      rechecking: "Need Recheck",
      waiting: "Waiting another BN",
      finished: "Modded",
      nominated: "Nominated",
      ranked: "Ranked",
      rejected: "Rejected",
      accepted: "Accepted",
      archived: "Archived",
      delete: "Delete",
    },
    actionStatus: {
      syncOption: "Sync",
      rechecking: "Need Recheck",
      waiting: "Waiting another BN",
      finished: "Modded",
      nominated: "Nominated",
      ranked: "Ranked",
      rejected: "Reject",
      accepted: "Accept",
      archived: "Archive",
      delete: "Delete",
      commentEdit: "Edit Comment",
      copyURL: "Copy request URL",
      beatmapPage: "Beatmap Page",
      beatmapDiscussion: "Beatmap Discussion",
    },
    mapperTitle: "mapped by $mapper",
    mapperCommentTitle: "Mapper's comment",
    noMapperComment: "No comment provided...",
    noFeeedback: "No feedback provided...",
  },
  ads: {
    title: "Sponsored links",
  },
  queues: {
    status: {
      open: "open",
      closed: "closed",
    },
    type: {
      modder: "modder",
      group: "group",
      nominator: "nominator",
    },
    requestButton: "Request",
    filters: {
      status: {
        // Options will use requests status localization
        label: "Status",
      },
      type: {
        label: "Type",
        options: {
          archived: "Archived",
          inProgress: "In Progress",
        },
      },
    },
  },
  settingsPanel: {
    title: "Settings",
    personalQueue: "Personal Queue",
    pages: {
      general: "General",
      requests: "Requests",
      modules: "Modules",
      user: "User Settings",
      admin: "Admin",
    },
    categories: {
      generic: {
        open: "Open",
        closed: "Closed",
        enable: "Enable",
        disable: "Disable",
        save: "Save",
      },
      queueStatus: {
        title: "Queue Status",
      },
      personalization: {
        title: "Personalization",
        options: {
          bannerURL: {
            label: "Banner URL",
            tip: "It will replace the current banner of your queue/group. You can use any image format.",
          },
          groupIcon: {
            label: "Group Name",
            tip: "It will replace the current name of your group. It will change the url too (If you use the name for access it.)",
          },
          groupName: {
            label: "Group Icon",
            tip: "It will replace the current icon of your group. You can use any image format.",
          },
        },
      },
      themeColor: {
        title: "Theme Color",
        options: {
          color: {
            label: "Selected color: $color (Need reload to apply)",
            tip: "The selected color will be used for highlight elements and navbar for everyone that access this queue (Including the OK button below)",
          },
        },
      },
      rules: {
        title: "Rules",
        options: {
          formatation: {
            label: "Formatation",
            tip: "It's the text that appears before an user request in your queue. You can use Markdown formatation or plain text.",
          },
        },
      },
      preferences: {
        title: "Preferences",
        options: {
          tags: {
            label: "What is it?",
            tip: "It will be used for index your queue in the search system. Press enter to add a tag.",
          },
        },
      },
      gamemodes: {
        title: "Allowed Gamemodes",
      },
      filters: {
        title: "Filters",
        options: {
          graveyard: {
            label: "Allow Graveyard beatmaps",
          },
          wip: {
            label: "Allow WIP beatmaps",
          },
          crossRequest: {
            label: "Allow users to request beatmaps from other users",
          },
        },
      },
    },
  },
  footer: {
    text: "Made with ❤️ by Sebola",
  },
};
