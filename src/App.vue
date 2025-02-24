<script lang="ts" setup>
import MainLayout from '@/layots/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <router-view :key="$route.fullPath" />
  </MainLayout>
  <Toast />
</template>

<style src="./assets/base.css"></style>
