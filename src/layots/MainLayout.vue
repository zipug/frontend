<script lang="ts" setup>
import { ref } from 'vue'

const items = ref([
  {
    separator: true,
  },
  {
    label: 'Documents',
    items: [
      {
        label: 'New',
        icon: 'pi pi-plus',
        shortcut: '⌘+N',
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
        shortcut: '⌘+S',
      },
    ],
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        shortcut: '⌘+O',
      },
      {
        label: 'Messages',
        icon: 'pi pi-inbox',
        badge: 2,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        shortcut: '⌘+Q',
      },
    ],
  },
  {
    separator: true,
  },
])
</script>

<template>
  <main class="bg-zinc-950 px-6 py-12 md:px-12 lg:px-20">
    <button
      aria-controls="default-sidebar"
      class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      data-drawer-target="default-sidebar"
      data-drawer-toggle="default-sidebar"
      type="button"
    >
      <span class="sr-only">Open sidebar</span>
      <svg
        aria-hidden="true"
        class="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          fill-rule="evenodd"
        ></path>
      </svg>
    </button>

    <aside
      id="default-sidebar"
      aria-label="Sidebar"
      class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
    >
      <Menu :model="items" class="w-full h-full px-3 py-4 overflow-y-auto bg-zinc-50">
        <template #start>
          <span class="inline-flex items-center gap-1 px-2 py-2">
            <span class="text-xl font-semibold">PRIME<span class="text-primary">APP</span></span>
          </span>
        </template>
        <template #item="{ item, props }">
          <a v-ripple class="flex items-center" v-bind="props.action">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
            <Badge v-if="item.badge" :value="item.badge" class="ml-auto" />
            <span
              v-if="item.shortcut"
              class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
              >{{ item.shortcut }}</span
            >
          </a>
        </template>
        <template #end>
          <button
            v-ripple
            class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200"
          >
            <Avatar
              class="mr-2"
              image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
              shape="circle"
            />
            <span class="inline-flex flex-col items-start">
              <span class="font-bold">Amy Elsner</span>
              <span class="text-sm">Admin</span>
            </span>
          </button>
        </template>
      </Menu>
    </aside>

    <div class="p-4 sm:ml-64">
      <slot />
    </div>
  </main>
</template>
