import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import { useToast } from 'primevue'
import type { Permission } from '@/models/role'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/AuthView.vue'),
      props: { type: 'login' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/AuthView.vue'),
      props: { type: 'register' },
    },
    {
      path: '/users/me',
      name: 'me',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/users/all',
      name: 'users_all',
      component: () => import('../views/UsersView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_read:users_feature'],
      },
    },
    {
      path: '/users/profile/:id',
      name: 'users_id',
      component: () => import('../views/UserProfileView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_read:users_feature'],
      },
    },
    {
      path: '/users/create',
      name: 'users_create',
      component: () => import('../views/UserProfileCreateView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_create:users_feature'],
      },
    },
    {
      path: '/roles/all',
      name: 'roles_all',
      component: () => import('../views/RolesView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_update:roles_feature'],
      },
    },
    {
      path: '/reports/all',
      name: 'reports_all',
      component: () => import('../views/ReportsView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_read:reports_feature'],
      },
    },
    {
      path: '/reports/generated/all',
      name: 'generated_reports_all',
      component: () => import('../views/GeneratedReportsView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_read:reports_feature'],
      },
    },
    {
      path: '/reports/create',
      name: 'reports_create',
      component: () => import('../views/ReportsView.vue'),
      props: { isCreateAction: true },
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_update:reports_feature'],
      },
    },
    {
      path: '/attachments/all',
      name: 'attachments_all',
      component: () => import('../views/AttachmentsView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_read:attachments_feature'],
      },
    },
    {
      path: '/articles/all',
      name: 'articles_all',
      component: () => import('../views/ArticlesView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_read:articles_feature'],
      },
    },
    {
      path: '/articles/:id',
      name: 'articles_id',
      component: () => import('../views/ArticleView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_update:articles_feature'],
      },
    },
    {
      path: '/articles/create',
      name: 'articles_create',
      component: () => import('../views/ArticleView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_create:articles_feature'],
      },
      props: { isCreate: true },
    },
    {
      path: '/bots/all',
      name: 'bots_all',
      component: () => import('../views/BotsView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_read:bots_feature'],
      },
    },
    {
      path: '/bots/:id',
      name: 'bots_id',
      component: () => import('../views/BotEditView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_update:bots_feature'],
      },
      props: { isCreate: false },
    },
    {
      path: '/bots/create',
      name: 'bots_create',
      component: () => import('../views/BotEditView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_create:bots_feature'],
      },
      props: { isCreate: true },
    },
    {
      path: '/projects/all',
      name: 'projects_all',
      component: () => import('../views/ProjectsView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_read:projects_feature'],
      },
    },
    {
      path: '/projects/:id',
      name: 'projects_id',
      component: () => import('../views/ProjectEditView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_update:projects_feature'],
      },
      props: { isCreate: false },
    },
    {
      path: '/projects/create',
      name: 'projects_create',
      component: () => import('../views/ProjectEditView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_create:projects_feature'],
      },
      props: { isCreate: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuth) {
      try {
        const toast = useToast()
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Пользователь не авторизован',
          life: 5000,
        })
      } catch (err) {
        console.log(err)
      }
      return '/login'
    }
    if (to.meta.requiredPermissions) {
      let flag = false
      const perms: Permission[] = authStore.getUserData?.role?.permissions as Permission[]
      for (let i = 0; i < perms.length; i++) {
        const permissions = to.meta.requiredPermissions as string[]
        const [action, name] = permissions[0].split(':')
        if (perms[i].name === name && action in perms[i]) {
          if (action === 'do_read' && !!perms[i]?.do_read) {
            flag = true
            break
          }
          if (action === 'do_create' && !!perms[i]?.do_create) {
            flag = true
            break
          }
          if (action === 'do_update' && !!perms[i]?.do_update) {
            flag = true
            break
          }
          if (action === 'do_delete' && !!perms[i]?.do_delete) {
            flag = true
            break
          }
        }
      }
      if (!flag) {
        try {
          const toast = useToast()
          toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'У вас нет прав для просмотра данной страницы',
            life: 5000,
          })
        } catch (err) {
          console.log(err)
        }
        return from.path
      }
    }
  }
})

export default router
