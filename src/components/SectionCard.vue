<script setup lang="ts">
interface cardProps {
  title: string
  icon: string
  description: string
  color: string
}
const props = defineProps<cardProps>()
</script>

<template>
  <div
    class="hover:border-zinc-700 border-[1px] hover:border-[1px] border-transparent rounded-md w-full flex flex-row justify-between items-center pr-6"
  >
    <Card class="flex !flex-row !justify-start !items-center !px-5 gap-2">
      <template #header>
        <i :class="icon + ` ${color} ` + 'p-4 rounded-md'" style="font-size: 1.5rem"></i>
      </template>
      <template #title>
        <span class="w-full">{{ title }}</span>
      </template>
      <template #content>
        <p class="m-0 font-light text-ellipsis text-zinc-400">{{ description }}</p>
      </template>
    </Card>
    <i class="pi pi-angle-right font-light" style="font-size: 1.5rem"></i>
  </div>
</template>
