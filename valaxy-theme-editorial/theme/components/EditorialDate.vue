<script setup lang="ts">
import { formatDate, useSiteConfig } from 'valaxy'
import { computed } from 'vue'

const props = defineProps<{ date?: Date | number | string }>()
const site = useSiteConfig()
const date = computed(() => {
  if (!props.date || Number.isNaN(new Date(props.date).getTime()))
    return ''
  return formatDate(props.date, { timezone: site.value.timezone || 'UTC' })
})
</script>

<template>
  <time v-if="date" :datetime="date" class="ed-date">{{ date }}</time>
</template>
