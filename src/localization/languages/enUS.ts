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
  footer: {
    text: "Made with ❤️ by Sebola",
  },
};
