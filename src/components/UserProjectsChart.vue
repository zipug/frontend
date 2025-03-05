<script setup lang="ts">
import { computed, ref } from 'vue'

interface ChartProjects {
  name: string
  bot_id: number
  users: number
  bg: string
  br: string
}

interface ChartProps {
  projects: ChartProjects[]
}

const props = defineProps<ChartProps>()
const documentStyle = getComputedStyle(document.documentElement)
const textColor = documentStyle.getPropertyValue('--p-text-color')
const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

const chartData = computed(() => {
  return {
    labels: props.projects.map((el: any) => el.name),
    datasets: props.projects.map((el: any) => ({
      label: el.name,
      data: [el.users],
      backgroundColor: [el.bg],
      borderColor: [el.br],
      borderWidth: 1,
    })),
  }
})
/*{
      label: 'Sales',
      data: [540, 325, 702, 620],
      backgroundColor: [
        'rgba(249, 115, 22, 0.2)',
        'rgba(6, 182, 212, 0.2)',
        'rgb(107, 114, 128, 0.2)',
        'rgba(139, 92, 246 0.2)',
      ],
      borderColor: [
        'rgb(249, 115, 22)',
        'rgb(6, 182, 212)',
        'rgb(107, 114, 128)',
        'rgb(139, 92, 246)',
      ],
      borderWidth: 1,
    },*/
const chartOptions = ref({
  plugins: {
    legend: {
      labels: {
        color: textColor,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: textColorSecondary,
      },
      grid: {
        color: surfaceBorder,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: textColorSecondary,
      },
      grid: {
        color: surfaceBorder,
      },
    },
  },
})
</script>

<template>
  <Chart type="bar" :data="chartData" :options="chartOptions" />
</template>
