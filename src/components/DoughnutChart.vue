<script setup lang="ts">
import { computed, ref } from 'vue'

interface ChartProps {
  resolved: number
  not_resolved: number
}

const props = defineProps<ChartProps>()
const documentStyle = getComputedStyle(document.documentElement)
const textColor = documentStyle.getPropertyValue('--p-text-color')
const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

function getRandomColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return { rgba: `rgba(${r}, ${g}, ${b}, ${0.25})`, rgb: `rgb(${r}, ${g}, ${b})` }
}
const colors = [getRandomColor(), getRandomColor()]

const chartData = computed(() => ({
  labels: ['Решённые', 'Нерешённые'],
  datasets: [
    {
      data: [props.resolved, props.not_resolved],
      backgroundColor: colors.map((color: any) => color.rgba),
      hoverBackgroundColor: colors.map((color: any) => color.rgb),
    },
  ],
}))
const chartOptions = ref({
  plugins: {
    legend: {
      labels: {
        cutout: '60%',
        color: textColor,
      },
    },
  },
})
</script>

<template>
  <Chart type="doughnut" :data="chartData" :options="chartOptions" />
</template>
