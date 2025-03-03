<script setup lang="ts">
import { computed, ref } from 'vue'

interface CpuChartProps {
  cpu: number[]
}

const props = defineProps<CpuChartProps>()
const documentStyle = getComputedStyle(document.documentElement)
const textColor = documentStyle.getPropertyValue('--p-text-color')
const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

const chartData = computed(() => ({
  labels: props?.cpu?.map((_, i) => i * 5),
  datasets: [
    {
      type: 'line',
      label: 'CPU Usage %',
      borderColor: documentStyle.getPropertyValue('--p-orange-500'),
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      data: props?.cpu,
    },
  ],
}))
const chartOptions = ref({
  maintainAspectRatio: true,
  aspectRatio: 6,
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
  <Chart type="line" :data="chartData" :options="chartOptions" />
</template>
