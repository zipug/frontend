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
    route: '/projects/all',
  },
  {
    label: 'Боты',
    icon: 'pi pi-telegram',
    permission: 'do_read:bots_feature',
    route: '/bots/all',
  },
  {
    label: 'Чаты',
    icon: 'pi pi-comment',
    permission: 'do_read:chats_feature',
    route: '/chats/all',
  },
  {
    label: 'Статьи',
    icon: 'pi pi-pencil',
    permission: 'do_read:articles_feature',
    route: '/articles/all',
  },
  {
    label: 'Вложения',
    icon: 'pi pi-database',
    permission: 'do_read:attachments_feature',
    route: '/attachments/all',
  },
  {
    label: 'Пользователи',
    icon: 'pi pi-user',
    permission: 'do_read:users_feature',
    route: '/users/all',
  },
  {
    label: 'Роли',
    icon: 'pi pi-key',
    permission: 'do_update:roles_feature',
    route: '/roles/all',
  },
]
