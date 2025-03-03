<script lang="ts" setup>
import MainLayout from '@/layots/MainLayout.vue'
import { onUnmounted } from 'vue'
import { useResourcesStore } from './stores/resources'
import { RESOURCES_WS_URL } from './constants/api'

const resourcesStore = useResourcesStore()
const socket = new WebSocket(RESOURCES_WS_URL)
socket.addEventListener('message', (event) => {
  resourcesStore.updateResources(event)
})

onUnmounted(() => {
  resourcesStore.clearResources()
})
</script>

<template>
  <MainLayout>
    <router-view :key="$route.fullPath" />
  </MainLayout>
  <Toast />
</template>

<style src="./assets/base.css"></style>
