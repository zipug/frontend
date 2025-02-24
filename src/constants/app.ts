export const PANEL_ITEMS = [
  {
    label: 'Главная',
    icon: 'pi pi-home',
    route: '/',
  },
  {
    label: 'Проекты',
    icon: 'pi pi-server',
    permission: 'do_read:projects_feature',
    items: [
      {
        label: 'Список проектов',
        icon: 'pi pi-list',
        route: '/projects/all',
        permission: 'do_read:projects_feature',
      },
      {
        separator: true,
      },
      {
        label: 'Создать',
        icon: 'pi pi-plus',
        route: '/projects/create',
        permission: 'do_create:projects_feature',
      },
    ],
  },
  {
    label: 'Боты',
    icon: 'pi pi-telegram',
    permission: 'do_read:bots_feature',
    items: [
      {
        label: 'Список ботов',
        icon: 'pi pi-list',
        route: '/bots/all',
        permission: 'do_read:bots_feature',
      },
      {
        separator: true,
      },
      {
        label: 'Создать',
        icon: 'pi pi-plus',
        route: '/bots/create',
        permission: 'do_create:bots_feature',
      },
      {
        label: 'Запустить',
        icon: 'pi pi-play',
        route: '/bots/run',
        permission: 'do_update:bots_feature',
      },
      {
        label: 'Остановить',
        icon: 'pi pi-stop',
        route: '/bots/stop',
        permission: 'do_update:bots_feature',
      },
    ],
  },
  {
    label: 'Статьи',
    icon: 'pi pi-pencil',
    permission: 'do_read:articles_feature',
    items: [
      {
        label: 'Список статей',
        icon: 'pi pi-list',
        route: '/articles/all',
        permission: 'do_read:articles_feature',
      },
      {
        separator: true,
      },
      {
        label: 'Создать',
        icon: 'pi pi-plus',
        route: '/articles/create',
        permission: 'do_create:articles_feature',
      },
      {
        label: 'Редактировать',
        icon: 'pi pi-pencil',
        route: '/articles/update',
        permission: 'do_update:articles_feature',
      },
      {
        label: 'Удалить',
        icon: 'pi pi-trash',
        route: '/articles/delete',
        permission: 'do_delete:articles_feature',
      },
    ],
  },
  {
    label: 'Вложения',
    icon: 'pi pi-database',
    permission: 'do_read:attachments_feature',
    items: [
      {
        label: 'Список вложений',
        icon: 'pi pi-list',
        route: '/attachments/all',
        permission: 'do_read:attachments_feature',
      },
      {
        separator: true,
      },
      {
        label: 'Загрузить',
        icon: 'pi pi-upload',
        route: '/attachments/upload',
        permission: 'do_create:attachments_feature',
      },
      {
        label: 'Привязать',
        icon: 'pi pi-paperclip',
        route: '/attachments/bind',
        permission: 'do_update:attachments_feature',
      },
    ],
  },
  {
    label: 'Отчёты',
    icon: 'pi pi-file-excel',
    permission: 'do_read:reports_feature',
    items: [
      {
        label: 'Список отчётов',
        icon: 'pi pi-list',
        route: '/reports/all',
        permission: 'do_read:reports_feature',
      },
      {
        label: 'Список сгенерированных отчётов',
        icon: 'pi pi-list-check',
        route: '/reports/generated/all',
        permission: 'do_read:reports_feature',
      },
      {
        separator: true,
      },
      {
        label: 'Создать',
        icon: 'pi pi-plus',
        route: '/reports/create',
        permission: 'do_create:reports_feature',
      },
    ],
  },
  {
    label: 'Пользователи',
    icon: 'pi pi-user',
    permission: 'do_read:users_feature',
    items: [
      {
        label: 'Список пользователей',
        icon: 'pi pi-list',
        route: '/users/all',
        permission: 'do_read:users_feature',
      },
      /*{
        separator: true,
      },
      {
        label: 'Назначить роль',
        icon: 'pi pi-user-plus',
        route: '/users/grant',
      },*/
    ],
  },
  {
    label: 'Роли',
    icon: 'pi pi-key',
    permission: 'do_read:roles_feature',
    items: [
      {
        label: 'Список ролей',
        icon: 'pi pi-list',
        route: '/roles/all',
        permission: 'do_read:roles_feature',
      },
      {
        separator: true,
      },
      {
        label: 'Создать',
        icon: 'pi pi-plus',
        route: '/roles/create',
        permission: 'do_create:roles_feature',
      },
    ],
  },
]
