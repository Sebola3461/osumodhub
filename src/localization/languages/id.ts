export default {
  flag: "https://flagcdn.com/id.svg",
  navbar: {
    queues: "Antrian",
  },
  home: {
    search: {
      title: "Cari",
      placeholder: "Genre, usernames atau gaya map",
      categories: {
        labels: {
          type: "Tipe",
          status: "Status",
          mode: "Mode",
          sort: "Urutkan",
        },
        selects: {
          type: {
            any: "Semua",
            nominators: "Nominator",
            modders: "Modder",
            groups: "Grup",
          },
          mode: {
            any: "Semua",
          },
          status: {
            any: "Semua",
            open: "Terbuka",
            closed: "Tertutup",
          },
          sort: {
            any: "Semua",
            nameTop: "Nama (A-Z)",
            nameBottom: "Nama (Z-A)",
          },
        },
      },
    },
  },
  userSideMenu: {
    title: "Halo, $username!",
    options: {
      personalQueue: "Antrian saya",
      createQueue: "Buat antrian",
      settings: "Pengaturan",
      requests: "Permintaan saya",
      groups: "Grup saya",
      logout: "Keluar",
    },
  },
  requestPanel: {
    title: "Ajukan beatmap",
    tabs: {
      beatmaps: "beatmap",
      rules: "peraturan",
      request: "permintaan",
    },
    input: {
      placeholder: "Tempel link beatmap disini",
      button: "Ambil",
      invalid: "Ini bukan link beatmap osu!!",
    },
    rules: {
      agreeWithRules: "You must read the rules before request!",
      confirm: "Saya sudah membaca peraturannya",
    },
    request: {
      commentTitle: "Keterangan",
      confirm: "Ajukan",
    },
  },
  notificationsSideMenu: {
    title: "Notifikasi",
    clearNotifications: "Bersihkan semua notifikasi",
    clearInbox: "Kosong euy...",
    markAsRead: "Tandai sudah dibaca",
  },
  manageRequestPanel: {
    title: "Atur permintaan",
    requesterTag: "peminta",
    groupOwnerTag: "pemilik",
    groupManagerTag: "pengatur",
    tabs: {
      discussion: "Diskusi",
      manage: "Atur",
    },
    manageTab: {
      feedbackTitle: "Ulasan",
      placeholder: "Opsional",
    },
  },
  requests: {
    status: {
      any: "Semua",
      pending: "Tertunda",
      rechecking: "Perlu dicek ulang",
      waiting: "Menunggu BN lain",
      finished: "Sudah di-mod",
      nominated: "Ternominasi",
      ranked: "Ranked",
      rejected: "Ditolak",
      accepted: "Diterima",
      archived: "Diarsipkan",
      delete: "Hapus",
    },
    actionStatus: {
      syncOption: "Sinkronkan",
      rechecking: "Perlu dicek ulang",
      waiting: "Menunggu BN lain",
      finished: "Sudah di-mod",
      nominated: "Ternominasi",
      ranked: "Ranked",
      rejected: "Tolak",
      accepted: "Terima",
      archived: "Arsipkan",
      delete: "Hapus",
      commentEdit: "Sunting komentar",
      copyURL: "Salin link permintaan",
      beatmapPage: "Halaman Beatmap",
      beatmapDiscussion: "Diskusi Beatmap",
    },
    mapperTitle: "Dibuat oleh $mapper",
    mapperCommentTitle: "Komentar mapper",
    noMapperComment: "Komentar kosong...",
    noFeeedback: "Tidak ada ulasan...",
  },
  ads: {
    title: "Link sponsor",
  },
  queues: {
    status: {
      open: "terbuka",
      closed: "tertutup",
    },
    type: {
      modder: "modder",
      group: "grup",
      nominator: "nominator",
    },
    requestButton: "Ajukan",
    filters: {
      status: {
        // Options will use requests status localization
        label: "Status",
      },
      type: {
        label: "Tipe",
        options: {
          archived: "Diarsipkan",
          inProgress: "Sedang dikerjakan",
        },
      },
    },
  },
  footer: {
    text: "Dibuat dengan ❤️ oleh Sebola",
  },
};
