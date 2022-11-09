export default {
  flag: "https://flagcdn.com/de.svg",
  navbar: {
    queues: "Queues",
  },
  home: {
    search: {
      title: "Suchen",
      placeholder: "Genre, Nutzernamen oder Mapping Style",
      categories: {
        labels: {
          type: "Typ",
          status: "Status",
          mode: "Modus",
          sort: "Sortierung",
        },
        selects: {
          type: {
            any: "Alle",
            nominators: "Nominierer",
            modders: "Modder",
            groups: "Gruppen",
          },
          mode: {
            any: "Alle",
          },
          status: {
            any: "Alle",
            open: "Offen",
            closed: "Geschlossen",
          },
          sort: {
            any: "Alle",
            activity: "Activity",
            nameTop: "Name (A-Z)",
            nameBottom: "Name (Z-A)",
          },
        },
      },
    },
  },
  userSideMenu: {
    title: "Hallo, $username!",
    options: {
      personalQueue: "Meine Queue",
      createQueue: "Erstelle eine Queue",
      settings: "Einstellungen",
      requests: "Meine Requests",
      groups: "Meine Gruppen",
      logout: "Ausloggen",
    },
  },
  requestPanel: {
    title: "Beatmap requesten",
    tabs: {
      beatmaps: "Beatmaps",
      rules: "Regeln",
      request: "Request",
    },
    input: {
      placeholder: "Beatmap URL hier einfügen",
      button: "Fetch",
      invalid: "Das ist keine osu! Beatmap URL!",
    },
    rules: {
      agreeWithRules:
        "Du musst die Regln lesen bevor du etwas requesten kannst!",
      confirm: "Ich habe die Regeln gelesen",
    },
    request: {
      commentTitle: "Kommentieren",
      confirm: "Request",
    },
  },
  notificationsSideMenu: {
    title: "Benachrichtigungen",
    clearNotifications: "Benachrichtigungen löschen",
    clearInbox: "Leer hier...",
    markAsRead: "Als gelesen markieren",
  },
  manageRequestPanel: {
    title: "Requests verwalten",
    requesterTag: "Requester",
    groupOwnerTag: "Eigentümer",
    groupManagerTag: "Verwalter",
    tabs: {
      discussion: "Diskussion",
      manage: "Verwalten",
    },
    manageTab: {
      feedbackTitle: "Feedback",
      placeholder: "Optional",
    },
  },
  requests: {
    status: {
      any: "Alle",
      pending: "Ausstehend",
      rechecking: "Nachprüfen",
      waiting: "Wartet auf weiteren BN",
      finished: "Modded",
      nominated: "Nominiert",
      ranked: "Ranked",
      rejected: "Abgelehnt",
      accepted: "Akzeptiert",
      archived: "Archiviert",
      delete: "Löschen",
    },
    actionStatus: {
      syncOption: "Synchronisieren",
      rechecking: "Nachprüfen",
      waiting: "Wartet auf weiteren BN",
      finished: "Modded",
      nominated: "Nominiert",
      ranked: "Ranked",
      rejected: "Abgelehnt",
      accepted: "Akzeptiert",
      archived: "Archivieren",
      delete: "Löschen",
      commentEdit: "Kommentar editieren",
      copyURL: "URL kopieren",
      beatmapPage: "Beatmap-Übersicht",
      beatmapDiscussion: "Beatmap-Thema",
    },
    mapperTitle: "von $mapper erstellt",
    mapperCommentTitle: "Kommentar",
    noMapperComment: "kein Kommentar hinterlassen...",
    noFeeedback: "kein Feedback hinterlassen...",
  },
  ads: {
    title: "Gesponsort",
  },
  queues: {
    status: {
      open: "Offen",
      closed: "Geschlossen",
    },
    type: {
      modder: "Modder",
      group: "Gruppe",
      nominator: "Nominierer",
    },
    requestButton: "Request",
    filters: {
      status: {
        // Options will use requests status localization
        label: "Status",
      },
      type: {
        label: "Typ",
        options: {
          archived: "Archiviert",
          inProgress: "Ausstehend",
        },
      },
    },
  },
  footer: {
    text: "Made with ❤️ by Sebola",
  },
};
