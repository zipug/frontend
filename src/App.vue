<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import AuthView from '@/views/AuthView.vue'
import MainLayout from '@/layots/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <AuthView />
  </MainLayout>
  <VueQueryDevtools />
</template>

<style src="./assets/base.css"></style>
