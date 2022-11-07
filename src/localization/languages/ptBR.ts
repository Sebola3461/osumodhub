export default {
  flag: "https://flagcdn.com/br.svg",
  navbar: {
    queues: "Páginas",
  },
  home: {
    search: {
      title: "Pesquisar",
      placeholder: "Gêneros, usuários ou estilos de mapa",
      categories: {
        labels: {
          type: "Tipo",
          status: "Status",
          mode: "Modo",
          sort: "Listar por",
        },
        selects: {
          type: {
            any: "Todos",
            nominators: "Nominadores",
            modders: "Modders",
            groups: "Grupos",
          },
          mode: {
            any: "Todos",
          },
          status: {
            any: "Todos",
            open: "Aberto",
            closed: "Fechado",
          },
          sort: {
            any: "Todos",
            nameTop: "Nome (A-Z)",
            nameBottom: "Nome (Z-A)",
          },
        },
      },
    },
  },
  userSideMenu: {
    title: "Olá, $username!",
    options: {
      personalQueue: "Minha página",
      createQueue: "Criar uma página",
      settings: "Configurações",
      requests: "Minhas requisições",
      groups: "Meus Grupos",
      logout: "Sair",
    },
  },
  notificationsSideMenu: {
    title: "Notificações",
    clearNotifications: "Limpar tudo",
    clearInbox: "Nada aqui...",
    markAsRead: "Marcar como lido",
  },
  manageRequestPanel: {
    title: "Manejar beatmap",
    requesterTag: "requisitador",
    groupOwnerTag: "dono",
    groupManagerTag: "administrador",
    tabs: {
      discussion: "Discussão",
      manage: "Manejar",
    },
    manageTab: {
      feedbackTitle: "Feedback",
      placeholder: "Isso é opicional",
    },
  },
  requestPanel: {
    title: "Requisitar um beatmap",
    tabs: {
      beatmaps: "meus beatmaps",
      rules: "regras",
      request: "requisitação",
    },
    input: {
      placeholder: "Cole a URL de um mapa aqui!",
      button: "Importar",
      invalid: "Aquele link não é de um beatmap de osu!",
    },
    rules: {
      agreeWithRules: "Você precisa aceitar as regras antes!",
      confirm: "Eu li as regras",
    },
    request: {
      commentTitle: "Comentário",
      confirm: "Requisitar",
    },
  },
  requests: {
    status: {
      any: "Todos",
      pending: "Pendente",
      rechecking: "Rechecar",
      waiting: "Esperando outro BN",
      finished: "Modado",
      nominated: "Nominado",
      ranked: "Ranqueado",
      rejected: "Rejeitado",
      accepted: "Aceitado",
      archived: "Arquivado",
      delete: "Deletar",
    },
    actionStatus: {
      syncOption: "Sincronizar",
      rechecking: "Rechecando",
      waiting: "Esperando outro BN",
      finished: "Modado",
      nominated: "Nominado",
      ranked: "Ranqueado",
      rejected: "Rejeitar",
      accepted: "Aceitar",
      archived: "Arquivar",
      delete: "Deletar",
      commentEdit: "Editar Comentário",
      copyURL: "Copiar URL",
      beatmapPage: "Página do Beatmap",
      beatmapDiscussion: "Discussão do Beatmap",
    },
    mapperTitle: "mapeado por $mapper",
    mapperCommentTitle: "Comentário do Mapper",
    noMapperComment: "Nenhum comentário...",
    noFeeedback: "Sem feedback...",
  },
  ads: {
    title: "Patrocinadores",
  },
  queues: {
    status: {
      open: "aberto",
      closed: "fechado",
    },
    type: {
      modder: "modder",
      group: "grupo",
      nominator: "nominador",
    },
    requestButton: "Requisitar",
    filters: {
      status: {
        // Options will use requests status localization
        label: "Status",
      },
      type: {
        label: "Tipo",
        options: {
          archived: "Arquivado",
          inProgress: "Ativo",
        },
      },
    },
  },
  footer: {
    text: "Feito com ❤️ por Sebola",
  },
};
