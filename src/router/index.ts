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
      path: '/roles/all',
      name: 'roles_all',
      component: () => import('../views/RolesView.vue'),
      meta: {
        requiresAuth: true,
        requiredPermissions: ['do_read:roles_feature'],
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
          if (action === 'do_update' && !!perms[i]?.do_update) {
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
