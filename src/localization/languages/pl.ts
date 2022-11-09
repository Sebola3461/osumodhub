export default {
  flag: "https://flagcdn.com/id.svg",
  navbar: {
    queues: "Kolejki",
  },
  home: {
    search: {
      title: "Szukaj",
      placeholder: "Gatunki, nazwy użytkowników lub style tworzenia map",
      categories: {
        labels: {
          type: "Typ",
          status: "Status",
          mode: "Tryb",
          sort: "Sort według",
        },
        selects: {
          type: {
            any: "Wszyscy",
            nominators: "Nominatorzy",
            modders: "Modderzy",
            groups: "Grupy",
          },
          mode: {
            any: "Wszystkie",
          },
          status: {
            any: "Wszystkie",
            open: "Otwarte",
            closed: "Zamknięte",
          },
          sort: {
            any: "Wszystko",
            activity: "Activity",
            nameTop: "Nazwa (A-Z)",
            nameBottom: "Nazwa (Z-A)",
          },
        },
      },
    },
  },
  userSideMenu: {
    title: "Witaj, $username!",
    options: {
      personalQueue: "Moja kolejka",
      createQueue: "Stwórz kolejke",
      settings: "Ustawienia",
      requests: "Moje zlecenia",
      groups: "Moje grupy",
      logout: "Wyloguj się",
    },
  },
  notificationsSideMenu: {
    title: "Powiadomienia",
    clearNotifications: "Wyczyść wszystkie powiadomienia",
    clearInbox: "Nic tu nie ma...",
    markAsRead: "Zaznacz jako przeczytane",
  },
  manageRequestPanel: {
    title: "Zarządzaj prośbą",
    requesterTag: "zleceniodawca",
    groupOwnerTag: "właściciel",
    groupManagerTag: "zarządca",
    tabs: {
      discussion: "Dyskusja",
      manage: "Zarządzaj",
    },
    manageTab: {
      feedbackTitle: "Informacja zwrotna",
      placeholder: "Opcjonalne",
    },
  },
  requestPanel: {
    title: "Zleć beatmapę",
    tabs: {
      beatmaps: "Beatmapy",
      rules: "Zasady",
      request: "Zleć",
    },
    input: {
      placeholder: "Wklej adres beatmapy",
      button: "Zdobądź",
      invalid: "To nie jest poprawny adres beatmapy osu!",
    },
    rules: {
      agreeWithRules: "Musisz przeczytać zasady zanim wyślesz zlecenie!",
      confirm: "Zapoznałem się z zasadami",
    },
    request: {
      commentTitle: "Komentarz",
      confirm: "Zleć",
    },
  },
  requests: {
    status: {
      any: "Wszystko",
      pending: "Oczekujące",
      rechecking: "Wymaga ponownego sprawdzenia",
      waiting: "Oczekujące na drugiego BN",
      finished: "Zmodowane",
      nominated: "Znominowane",
      ranked: "Ranked",
      rejected: "Odrzucone",
      accepted: "Zaakceptowane",
      archived: "Zarchiwizowane",
      delete: "Usuń",
    },
    actionStatus: {
      syncOption: "Synchronizacja",
      rechecking: "Wymaga ponownego sprwadzenia",
      waiting: "Oczekujące na drugiego BN",
      finished: "Zmodowane",
      nominated: "Znominowane",
      ranked: "Ranked",
      rejected: "Odrzucone",
      accepted: "Zaakceptowane",
      archived: "Zarchiwizowane",
      delete: "Usuń",
      commentEdit: "Edytuj komentarz",
      copyURL: "Skopiuj adres zlecenia",
      beatmapPage: "Strona Beatmapy",
      beatmapDiscussion: "Dyskusja Beatmapy",
    },
    mapperTitle: "zmapowane przez $mapper",
    mapperCommentTitle: "Komenatrz mappera",
    noMapperComment: "Brak komentarza...",
    noFeeedback: "Brak informacji zwrotnej...",
  },
  ads: {
    title: "Sponsorowane linki",
  },
  queues: {
    status: {
      open: "otwarte",
      closed: "zamknięte",
    },
    type: {
      modder: "modder",
      group: "grupa",
      nominator: "nominator",
    },
    requestButton: "Zleć",
    filters: {
      status: {
        // Options will use requests status localization
        label: "Status",
      },
      type: {
        label: "Typ",
        options: {
          archived: "Zarchiwizowane",
          inProgress: "W trakcie",
        },
      },
    },
  },
  footer: {
    text: "Zrobione z ❤️ przez Sebola",
  },
};
